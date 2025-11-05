// app/dashboard/[id]/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { updateProfileAction } from "@/app/(root)/dashboard/[id]/actions/updateProfileAction";


export default function ProfileForm({ user }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        const result = await updateProfileAction(user.id, { name, email });
        if (result?.error) {
            setMessage("❌ " + result.error);
        } else {
            setMessage("✅ Údaje uložené!");
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Edit className="w-7 h-7 text-[#600000]" />
                Tvoje údaje
            </h2>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Používateľské meno
                    </label>
                    <p className="font-semibold text-lg">{user.username}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Meno
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#600000] transition"
                            placeholder="Tvoje meno"
                        />
                    ) : (
                        <p className="font-semibold text-lg">{name || "–"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#600000] transition"
                            placeholder="tvoj@email.sk"
                        />
                    ) : (
                        <p className="font-semibold text-lg">{email || "–"}</p>
                    )}
                </div>

                <div className="pt-4 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-[#600000] hover:bg-[#4b0000] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Save className="w-5 h-5" />
                                Uložiť
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setName(user.name || "");
                                    setEmail(user.email || "");
                                }}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-[#600000]/10 hover:bg-[#600000]/20 text-[#600000] py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Upraviť údaje
                        </button>
                    )}
                </div>

                {message && (
                    <p className={`text-center p-3 rounded-lg font-medium ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}