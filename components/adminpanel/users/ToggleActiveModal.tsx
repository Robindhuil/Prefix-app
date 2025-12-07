"use client";

import { useState } from "react";
import { X, Ban, CheckCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { toggleUserActiveAction } from "@/app/(root)/adminpanel/users/actions/toggleUserActiveAction";
import { useToast } from "@/components/ui/ToastProvider";

type ToggleActiveModalProps = {
    user: { id: number; username: string; isActive: boolean };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function ToggleActiveModal({ user, isOpen, onClose, onSuccess }: ToggleActiveModalProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

    if (!isOpen) return null;

    const newActiveState = !user.isActive;
    const action = newActiveState ? "activate" : "ban";

    const handleToggle = async () => {
        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("id", user.id.toString());
        formData.append("isActive", newActiveState.toString());

        const result = await toggleUserActiveAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            onSuccess();
            onClose();
        }

        if (result.success) {
            if (action === "activate") {
                addToast(t("toast.userActivated"), "success");
            } else if (action === "ban") {
                addToast(t("toast.userDeactived"), "success");
            } else {
                addToast(t("toast.userToggleActivateError"), "error");
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="background rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className=" cursor-pointer absolute top-4 right-4 interactive-text transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${newActiveState
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-orange-100 dark:bg-orange-900/30"
                            }`}
                    >
                        {newActiveState ? (
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        ) : (
                            <Ban className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-color mb-2">
                        {t(`adminPanel.${action}User`)}
                    </h2>
                    <div
                        className="input-text"
                        dangerouslySetInnerHTML={{
                            __html: t(`adminPanel.${action}Confirm`, { username: user.username })
                        }}
                    />
                    <p
                        className={`text-sm font-medium mt-3 ${newActiveState ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                            }`}
                    >
                        {t(`adminPanel.${action}Reversible`)}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 px-4 py-2 border border-custom text-white rounded-lg font-medium bg-neutral transition-all"
                    >
                        {t("adminPanel.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={isLoading}
                        className={`cursor-pointer flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${newActiveState
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-orange-600 hover:bg-orange-700"
                            }`}
                    >
                        {newActiveState ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        {isLoading ? t(`adminPanel.${action}ing`) : t(`adminPanel.${action}`)}
                    </button>
                </div>
            </div>
        </div>
    );
}