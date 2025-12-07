"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

    useEffect(() => {
        if (!isOpen) return;
        const scrollY = window.scrollY;
        document.documentElement.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarGap > 0) {
            document.documentElement.style.paddingRight = `${scrollbarGap}px`;
        }
        return () => {
            document.documentElement.style.overflow = "";
            document.documentElement.style.paddingRight = "";
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            if (top) {
                const y = parseInt(top || "0", 10) * -1;
                window.scrollTo(0, y);
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const newActiveState = !user.isActive;
    const action = newActiveState ? "activate" : "ban";

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

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

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                onClick={handleBackdropClick}
            />
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-4"
                onClick={handleBackdropClick}
            >
                <div
                    className="background rounded-2xl shadow-2xl w-screen max-w-md p-6 relative max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
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
        </>,
        typeof document !== "undefined" ? document.body : ({} as HTMLElement)
    );
}