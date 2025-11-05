// app/dashboard/[id]/components/PasswordForm.tsx
"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { changePasswordAction } from "@/app/(root)/dashboard/[id]/actions/changePasswordAction";


export default function PasswordForm() {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPass !== confirmPass) return setMessage("❌ Nové heslá sa nezhodujú");
        if (newPass.length < 6) return setMessage("❌ Heslo musí mať aspoň 6 znakov");

        setLoading(true);
        const result = await changePasswordAction(oldPass, newPass);
        setMessage(result.success ? "✅ Heslo zmenené!" : "❌ " + (result.error || "Chyba"));
        setLoading(false);
        if (result.success) {
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#600000] transition"
                />
                <input
                    type="password"
                    placeholder="Nové heslo"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#600000] transition"
                />
                <input
                    type="password"
                    placeholder="Zopakuj nové heslo"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#600000] transition"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#600000] hover:bg-[#4b0000] text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-70"
                >
                    {loading ? "Mením heslo..." : "Zmeniť heslo"}
                </button>

                {message && (
                    <p className={`text-center p-4 rounded-lg font-medium text-lg ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}