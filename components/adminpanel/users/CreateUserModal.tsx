"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Lock, User, Shield } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { createUserAction } from "@/app/(root)/adminpanel/actions/createUserAction";

type CreateUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

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

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-r from-[#600000] to-[#4b0000] rounded-full flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <User className="w-4 h-4" />
                            {t("adminPanel.username")}
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            minLength={3}
                            maxLength={50}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#600000] focus:border-transparent transition-all"
                            placeholder={t("adminPanel.usernamePlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Mail className="w-4 h-4" />
                            {t("adminPanel.email")}
                        </label>
                        <input
                            name="email"
                            type="email"
                            maxLength={100}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#600000] focus:border-transparent transition-all"
                            placeholder={t("adminPanel.emailPlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <User className="w-4 h-4" />
                            {t("adminPanel.name")}
                        </label>
                        <input
                            name="name"
                            type="text"
                            maxLength={100}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#600000] focus:border-transparent transition-all"
                            placeholder={t("adminPanel.namePlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Lock className="w-4 h-4" />
                            {t("adminPanel.password")}
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            maxLength={100}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#600000] focus:border-transparent transition-all"
                            placeholder={t("adminPanel.passwordPlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Shield className="w-4 h-4" />
                            {t("adminPanel.role")}
                        </label>
                        <select
                            name="role"
                            defaultValue="USER"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#600000] focus:border-transparent transition-all"
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
                            className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            {t("adminPanel.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer flex-1 px-4 py-2 bg-linear-to-r from-[#600000] to-[#4b0000] text-white rounded-lg font-medium hover:from-[#4b0000] hover:to-[#600000] transition-all disabled:opacity-50"
                        >
                            {isLoading ? t("adminPanel.creating") : t("adminPanel.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}