// app/dashboard/[id]/components/PasswordForm.tsx
"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { changePasswordAction } from "@/app/(root)/dashboard/[id]/actions/changePasswordAction";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useToast } from "../ui/ToastProvider";


export default function PasswordForm() {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loading, setLoading] = useState(false);

    const { addToast } = useToast();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            addToast(t("toast.userPasswordMismatch"), "error");
        }
        if (newPass.length < 6) {
            addToast(t("toast.userPasswordTooShort"), "error");
        };

        setLoading(true);
        const result = await changePasswordAction(oldPass, newPass);
        setLoading(false);
        if (result.success) {
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
        }
        if (result.success) {
            addToast(t("toast.userPasswordChanged"), "success");
        } else {
            addToast(t("toast.userPasswordError"), "error");
        }
    };

    return (
        <div className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl text-color font-bold mb-6 flex items-center gap-3">
                <Lock className="w-7 h-7 text-[#600000]" />
                Zmena hesla
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="password"
                    placeholder="Staré heslo"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 input-bg input-text border-custom focus-ring focus-border rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Nové heslo"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 input-bg input-text border-custom focus-ring focus-border rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Zopakuj nové heslo"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 input-bg input-text border-custom focus-ring focus-border rounded-lg"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cl-bg-decor cursor-pointer text-white py-4 rounded-lg font-bold text-lg disabled:opacity-70"
                >
                    {loading ? "Mením heslo..." : "Zmeniť heslo"}
                </button>
            </form>
        </div>
    );
}