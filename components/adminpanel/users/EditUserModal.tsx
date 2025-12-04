"use client";

import { useState } from "react";
import { X, Edit, Mail, Lock, User, Shield } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { updateUserAction } from "@/app/(root)/adminpanel/users/actions/updateUserAction";
import { useToast } from "@/components/ui/ToastProvider";

type User = {
    id: number;
    username: string;
    email: string | null;
    name: string | null;
    role: "USER" | "ADMIN";
};

type EditUserModalProps = {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("id", user.id.toString());

        const result = await updateUserAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            onSuccess();
            onClose();
        }

        if (result.success) {
            addToast(t("toast.userUpdated"), "success");
        } else {
            addToast(t("toast.userErrorUpdate"), "error");
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="background rounded-2xl shadow-2xl w-full max-w-md p-6 relative border-decor">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 interactive-text transition-colors cursor-pointer"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-r cl-bg-decor rounded-full flex items-center justify-center">
                        <Edit className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-color">
                        {t("adminPanel.editUser")}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="id" value={user.id} />

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                            <User className="w-4 h-4 cl-text-decor" />
                            {t("adminPanel.username")}
                        </label>
                        <input
                            name="username"
                            type="text"
                            defaultValue={user.username}
                            required
                            minLength={3}
                            maxLength={50}
                            className="w-full px-4 py-2 rounded-lg border border-custom input-bg input-text focus-border focus-ring transition-all"
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
                            defaultValue={user.email || ""}
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
                            defaultValue={user.name || ""}
                            maxLength={100}
                            className="w-full px-4 py-2 rounded-lg  border-custom input-bg input-text focus-border focus-ring transition-all"
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
                            minLength={6}
                            maxLength={100}
                            className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-border focus-ring  transition-all"
                            placeholder={t("adminPanel.passwordPlaceholderEdit")}
                            disabled={isLoading}
                        />
                        <p className="text-xs input-text mt-1">
                            {t("adminPanel.passwordLeaveBlank")}
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-color mb-1">
                            <Shield className="w-4 h-4 cl-text-decor" />
                            {t("adminPanel.role")}
                        </label>
                        <select
                            name="role"
                            defaultValue={user.role}
                            className="cursor-pointer w-full px-4 py-2 rounded-lg  border-custom input-bg input-text focus-border focus-ring transition-all"
                            disabled={isLoading}
                        >
                            <option value="USER">{t("adminPanel.roleUser")}</option>
                            <option value="ADMIN">{t("adminPanel.roleAdmin")}</option>
                        </select>
                    </div>

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
                            className="cursor-pointer flex-1 px-4 py-2 bg-linear-to-r cl-bg-decor border-custom text-white rounded-lg font-medium transition-all disabled:opacity-50"
                        >
                            {isLoading ? t("adminPanel.updating") : t("adminPanel.update")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}