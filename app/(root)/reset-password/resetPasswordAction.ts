"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";


const EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

// Helper data access functions
async function findResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({
        where: { token },
    });
}

async function markTokenUsed(token: string) {
    await prisma.passwordResetToken.update({
        where: { token },
        data: { used: true, usedAt: new Date() },
    });
}

async function updateUserPassword(email: string, passwordHash: string) {
    await prisma.user.update({
        where: { email },
        data: { hashedpassword: passwordHash, updatedAt: new Date() },
    });
}

// Validate token for page access
export async function validateResetToken(token: string): Promise<{ valid: boolean }> {
    if (!token) return { valid: false };
    const record = await findResetToken(token);
    if (!record) return { valid: false };
    if (record.used) return { valid: false };
    const age = Date.now() - new Date(record.createdAt).getTime();
    if (age > EXPIRATION_MS) return { valid: false };
    return { valid: true };
}

export async function resetPasswordAction(params: { email: string; token: string; newPassword: string }): Promise<{ success?: boolean; error?: string }> {
    const { email, token, newPassword } = params;

    // Basic input checks
    if (!token || !newPassword) {
        return { error: "Invalid request." };
    }

    // Fetch token from your DB
    const record = await findResetToken(token);

    // Validate token record
    if (!record) {
        return { error: "Invalid or expired token." };
    }
    if (record.used) {
        return { error: "This reset link has already been used." };
    }

    // Trust the token payload, not the client-provided email
    const effectiveEmail = record.email;

    const age = Date.now() - new Date(record.createdAt).getTime();
    if (age > EXPIRATION_MS) {
        await markTokenUsed(token);
        return { error: "This reset link has expired. Request a new one." };
    }

    // Hash and update password with bcrypt
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateUserPassword(effectiveEmail, passwordHash);

    // Invalidate token (one-time use)
    await markTokenUsed(token);

    // Hard delete token to fully close the link
    try {
        await prisma.passwordResetToken.delete({ where: { token } });
    } catch {
        // ignore if already deleted or concurrent op
    }

    return { success: true };
}