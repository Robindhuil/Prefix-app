// app/dashboard/[id]/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { updateProfileAction } from "@/app/(root)/dashboard/[id]/actions/updateProfileAction";
import { useToast } from "../ui/ToastProvider";
import { useTranslation } from "@/app/i18n/I18nProvider";

type User = {
    id: number;
    username: string;
    name?: string;
    email?: string;
    // Add other user fields as needed
};

export default function ProfileForm({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const { addToast } = useToast();
    const { t } = useTranslation();

    const handleSave = async () => {
        const result = await updateProfileAction(user.id, { name, email });
        if (result?.error) {
            addToast(t("toast.userProfileError"), "error");

        } else {
            addToast(t("toast.userProfileUpdated"), "success");
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl text-color font-bold mb-6 flex items-center gap-3">
                <Edit className="w-7 h-7 cl-text-decor" />
                Tvoje údaje
            </h2>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium cl-text-decor mb-1">
                        Používateľské meno
                    </label>
                    <p className="text-color font-semibold text-lg">{user.username}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium cl-text-decor mb-1">
                        Meno
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-2 input-bg input-text border-custom focus-ring focus-border rounded-lg "
                            placeholder="Tvoje meno"
                        />
                    ) : (
                        <p className="text-color font-semibold text-lg">{name || "–"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium cl-text-decor mb-1">
                        Email
                    </label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 input-bg input-text border-custom focus-ring focus-border rounded-lg"
                            placeholder="tvoj@email.sk"
                        />
                    ) : (
                        <p className="text-color font-semibold text-lg">{email || "–"}</p>
                    )}
                </div>

                <div className="pt-4 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="cursor-pointer flex-1 cl-bg-decor text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
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
                                className="cursor-pointer px-6 py-3 bg-neutral rounded-lg font-medium transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer w-full cl-bg-decor text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Upraviť údaje
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}