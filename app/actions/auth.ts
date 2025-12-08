"use server";
import { signIn } from "next-auth/react";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

export async function forgotPasswordAction(userEmail: string) {
    try {
        // Basic server-side email validation
        const email = (userEmail || "").trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: "Invalid email", errorKey: "login.errors.emailInvalid" };
        }

        // 1) Ensure user exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, isActive: true },
        });
        if (!user || !user.email) {
            return { error: "USER_NOT_FOUND", errorKey: "login.errors.userNotFound" };
        }
        if (user.isActive === false) {
            return { error: "ACCOUNT_DEACTIVATED", errorKey: "login.accountDeactivated" };
        }

        // 2) Create single-use reset token
        const token = crypto.randomUUID();
        await prisma.passwordResetToken.create({
            data: {
                token,
                email: user.email,
                userId: user.id,
            },
        });

        const company = await prisma.companyInfo.findFirst();
        if (!company) {
            return { error: "Company info not found", errorKey: "login.errors.missingCompanyInfo" };
        }
        const replyToEmail = company.contactEmail;
        if (!replyToEmail) {
            return { error: "Missing company contact email", errorKey: "login.errors.missingCompanyEmail" };
        }

        const {
            RESEND_API_KEY,
            RESEND_FROM,
            NEXTAUTH_URL,
            NEXT_PUBLIC_APP_URL,
            VERCEL_URL,
            NODE_ENV,
        } = process.env;

        if (!RESEND_API_KEY) {
            return { error: "Email API missing", errorKey: "login.errors.emailApiMissing" };
        }
        if (!RESEND_FROM) {
            return { error: "Sender address missing", errorKey: "login.errors.emailFromMissing" };
        }

        // sanitize and validate "from" identity
        const stripQuotes = (s: string) => s.replace(/^['"]|['"]$/g, "");
        const fromSanitized = stripQuotes(RESEND_FROM);
        const emailOnlyRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email
        const nameAddrRegex = /^.+\s<[^@\s]+@[^@\s]+\.[^@\s]+>$/; // "Name <email@domain>"
        const baseUrl =
            NEXTAUTH_URL ||
            NEXT_PUBLIC_APP_URL ||
            (VERCEL_URL ? `https://${VERCEL_URL}` : "http://localhost:3000");

        // 3) Build tokenized link
        const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

        const subject = "Password reset request";
        const text = `Reset your password:\n${resetLink}\n\nIf you didn't request this, ignore this email.`;
        const html = `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;background:#f8fafc;padding:24px">
  <div style="max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
    <h2 style="margin:0 0 8px 0;color:#0f172a;">Reset your password</h2>
    <p style="margin:0 0 16px 0;color:#334155;">We received a request to reset the password associated with ${email}.</p>
    <p style="margin:0 0 16px 0;color:#334155;">Click the button below to reset your password.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Reset password</a>
    </p>
    <p style="margin:16px 0;color:#64748b;font-size:12px">If you did not request this, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
    <p style="margin:0;color:#94a3b8;font-size:12px">If the button doesn't work, paste this link into your browser:<br/><span style="word-break:break-all">${resetLink}</span></p>
  </div>
</div>`.trim();

        const resend = new Resend(RESEND_API_KEY);
        const sendWithFrom = async (fromIdentity: string) => {
            return await resend.emails.send({
                from: fromIdentity,
                to: [email],
                subject,
                html,
                text,
                replyTo: replyToEmail,
            });
        };

        // Try with provided sender; fallback on onboarding when needed
        let { error: sendError } = await sendWithFrom(fromSanitized);
        if (sendError) {
            const name = String((sendError as any)?.name || "").toLowerCase();
            const msg = String((sendError as any)?.message || "").toLowerCase();
            const senderIssue =
                name.includes("validation") ||
                msg.includes("validation") ||
                msg.includes("permission") ||
                msg.includes("domain") ||
                msg.includes("from") ||
                msg.includes("sender");

            if (senderIssue) {
                const retry = await sendWithFrom("Prefix <onboarding@resend.dev>");
                if (!retry.error) {
                    // Success on fallback; return dev helpers too
                    return { success: true, token, resetUrl: resetLink, simulated: NODE_ENV !== "production" };
                }
                sendError = retry.error;
            }

            const name2 = String((sendError as any)?.name || "").toLowerCase();
            const msg2 = String((sendError as any)?.message || "").toLowerCase();
            if (name2.includes("validation") || msg2.includes("validation")) {
                return { error: "Validation error", errorKey: "login.errors.emailValidationFailed" };
            }
            if (msg2.includes("permission") || msg2.includes("domain") || msg2.includes("from") || msg2.includes("sender")) {
                return { error: "Email sender not allowed", errorKey: "login.errors.emailSenderNotAllowed" };
            }
            return { error: "Failed to send email", errorKey: "login.serverError" };
        }

        // Success
        return { success: true, token, resetUrl: resetLink, simulated: NODE_ENV !== "production" };
    } catch (err) {
        console.error("forgotPasswordAction error:", err);
        return { error: "Failed to send email", errorKey: "login.serverError" };
    }
}

export async function signInAction(formData: FormData) {
    const username = (formData.get("username") as string | null)?.trim() || "";
    const password = formData.get("password") as string | null;

    if (!username) {
        return { error: "USERNAME_REQUIRED" };
    }
    if (!password) {
        return { error: "PASSWORD_REQUIRED" };
    }
    if (password.length < 6) {
        return { error: "PASSWORD_TOO_SHORT" };
    }

    try {
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            // Pass through known errors or normalize to INVALID_CREDENTIALS
            const knownErrors = new Set([
                "ACCOUNT_DEACTIVATED",
                "INVALID_CREDENTIALS",
                "USER_NOT_FOUND",
            ]);
            return {
                error: knownErrors.has(result.error) ? result.error : "INVALID_CREDENTIALS",
            };
        }

        return { success: true };
    } catch {
        return { error: "SERVER_ERROR" };
    }
}