"use client";

import { useState } from "react";
import { X, Trash2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { deleteUserAction } from "@/app/(root)/adminpanel/users/actions/deleteUserAction";
import { useToast } from "@/components/ui/ToastProvider";

type DeleteUserModalProps = {
    user: { id: number; username: string };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function DeleteUserModal({ user, isOpen, onClose, onSuccess }: DeleteUserModalProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("id", user.id.toString());

        const result = await deleteUserAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            onSuccess();
            onClose();
        }

        if (result.success) {
            addToast(t("toast.userDeleted"), "success");
        } else {
            addToast(t("toast.userErrorDelete"), "error");
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className=" cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t("adminPanel.deleteUser")}
                    </h2>
                    <p
                        className="text-gray-600 dark:text-gray-400"
                        dangerouslySetInnerHTML={{
                            __html: t("adminPanel.deleteConfirm", { username: user.username }),
                        }}
                    />
                    <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                        {t("adminPanel.deleteIrreversible")}
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
                        className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        {t("adminPanel.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isLoading ? t("adminPanel.deleting") : t("adminPanel.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}