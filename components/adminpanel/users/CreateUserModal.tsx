"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Mail, Lock, User, Shield } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { createUserAction } from "@/app/(root)/adminpanel/users/actions/createUserAction";
import { useToast } from "@/components/ui/ToastProvider";

type CreateUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
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

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await createUserAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            onSuccess();
            onClose();
        }

        if (result.success) {
            addToast(t("toast.userCreated"), "success");
        } else {
            addToast(t("toast.userErrorCreate"), "error");
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
                    className="background rounded-2xl shadow-2xl w-screen max-w-md p-6 relative border-decor max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="cursor-pointer absolute top-4 right-4 interactive-text transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-r cl-bg-decor rounded-full flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-color">
                            {t("adminPanel.createUser")}
                        </h2>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                                <User className="w-4 h-4 cl-text-decor" />
                                {t("adminPanel.username")}
                            </label>
                            <input
                                name="username"
                                type="text"
                                required
                                minLength={3}
                                maxLength={50}
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring transition-all"
                                placeholder={t("adminPanel.usernamePlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                                <Mail className="w-4 h-4 cl-text-decor" />
                                {t("adminPanel.email")}
                            </label>
                            <input
                                name="email"
                                type="email"
                                maxLength={100}
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring transition-all"
                                placeholder={t("adminPanel.emailPlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                                <User className="w-4 h-4 cl-text-decor" />
                                {t("adminPanel.name")}
                            </label>
                            <input
                                name="name"
                                type="text"
                                maxLength={100}
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring transition-all"
                                placeholder={t("adminPanel.namePlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                                <Lock className="w-4 h-4 cl-text-decor" />
                                {t("adminPanel.password")}
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                maxLength={100}
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring transition-all"
                                placeholder={t("adminPanel.passwordPlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-mediumtext-color mb-1">
                                <Shield className="w-4 h-4" />
                                {t("adminPanel.role")}
                            </label>
                            <select
                                name="role"
                                defaultValue="USER"
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring transition-all cursor-pointer"
                                disabled={isLoading}
                            >
                                <option value="USER">{t("adminPanel.roleUser")}</option>
                                <option value="ADMIN">{t("adminPanel.roleAdmin")}</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="cursor-pointer flex-1 px-4 py-2 border border-custom text-white rounded-lg font-medium bg-neutral transition-all"
                            >
                                {t("adminPanel.cancel")}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer flex-1 px-4 py-2 bg-linear-to-r cl-bg-decor text-white rounded-lg font-medium transition-all disabled:opacity-50"
                            >
                                {isLoading ? t("adminPanel.creating") : t("adminPanel.create")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        typeof document !== "undefined" ? document.body : ({} as HTMLElement)
    );
}