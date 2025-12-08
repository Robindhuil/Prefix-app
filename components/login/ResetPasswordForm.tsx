"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { AlertCircle } from "lucide-react";
import { resetPasswordAction, validateResetToken } from "@/app/(root)/reset-password/resetPasswordAction";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm({ email, token }: { email: string; token: string }) {
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    // Decode email if present, but do not require it
    const rawEmail = email || searchParams.get("email") || "";
    const resolvedEmail = typeof window !== "undefined" ? decodeURIComponent(rawEmail) : rawEmail;

    // Try multiple sources for token: props, query (?token= or ?t=), hash (#token=)
    const [resolvedToken, setResolvedToken] = useState<string>((token || searchParams.get("token") || searchParams.get("t") || "").trim());
    useEffect(() => {
        if (resolvedToken) return;
        if (typeof window !== "undefined" && window.location.hash) {
            const hash = window.location.hash.replace(/^#/, "");
            const params = new URLSearchParams(hash);
            const fromHash = params.get("token") || params.get("t") || "";
            if (fromHash) setResolvedToken(fromHash.trim());
        }
    }, [resolvedToken]);

    // Redirect home if token is invalid/used/expired/missing
    useEffect(() => {
        const check = async () => {
            const tok = (resolvedToken || "").trim();
            if (!tok) {
                window.location.href = "/";
                return;
            }
            try {
                const res = await validateResetToken(tok);
                if (!res.valid) {
                    window.location.href = "/";
                }
            } catch {
                window.location.href = "/";
            }
        };
        check();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedToken]);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Only token is required to proceed
        if (!resolvedToken) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (!password || !confirm) {
            setError("Please fill out all fields.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            // Pass email if available; server trusts token’s email anyway
            const res = await resetPasswordAction({ email: resolvedEmail || "", token: resolvedToken, newPassword: password });
            if (res.error) {
                setError(res.error);
                addToast(res.error, "error");
                return;
            }
            addToast("Password updated successfully.", "success");
            // Redirect to login
            window.location.href = "/login";
        } catch {
            setError("Server error. Please try again.");
            addToast("Server error. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Show decoded email if available, otherwise hide the field */}
            {resolvedEmail && (
                <div>
                    <label className="block text-sm font-medium text-color mb-1">Email</label>
                    <input
                        type="email"
                        value={resolvedEmail}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all opacity-70"
                    />
                </div>
            )}
            {error && (
                <div className="mb-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
            )}
            {!resolvedToken && (
                <div className="mb-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-sm text-yellow-700">
                    Missing token in the reset link. Expected format:
                    <br />
                    <code>/reset-password?token=YOUR_TOKEN[&email=user@example.com]</code>
                    <br />
                    Your current link only has email:
                    <br />
                    <code>/reset-password?email=robogasso%40gmail.com</code>
                    <br />
                    Please request a new reset email.
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-color mb-1">New password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                    placeholder="At least 8 characters"
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-color mb-1">Confirm new password</label>
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                    placeholder="Re-enter password"
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                className="cursor-pointer w-full py-3 cl-bg-decor text-white font-semibold rounded-lg shadow-md hover:cl-bg-decor-hover transition disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? "Saving..." : "Save new password"}
            </button>
        </form>
    );
}
