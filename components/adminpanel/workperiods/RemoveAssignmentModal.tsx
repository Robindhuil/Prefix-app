"use client";

import { X, AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { removeAssignmentAction } from "@/app/(root)/adminpanel/workperiods/actions/removeAssignmentAction";

type RemoveAssignmentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user: { id: number; username: string; name?: string | null } | null;
    workPeriodId: number;
    onSuccess: () => void;
};

export default function RemoveAssignmentModal({
    isOpen,
    onClose,
    user,
    workPeriodId,
    onSuccess,
}: RemoveAssignmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

    if (!isOpen || !user) return null;

    const handleRemove = async () => {
        setIsLoading(true);
        setError("");

        const res = await removeAssignmentAction({
            userId: user.id,
            workPeriodId,
        });

        if (res.success) {
            addToast("Používateľ bol odstránený z obdobia.", "success");
            onSuccess();
            onClose();
        } else {
            setError(res.error || "Nepodarilo sa odstrániť používateľa.");
            addToast("Nepodarilo sa odstrániť používateľa.", "error");
        }

        setIsLoading(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="background rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} // 🔒 zabráni kliknutiu mimo, aby nevyvolalo scroll
            >
                {/* Zavrieť */}
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 interactive-text transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Obsah */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-color mb-2">
                        Odstrániť priradenie
                    </h2>
                    <p className="input-text">
                        Naozaj chceš odstrániť{" "}
                        <span className="font-semibold">
                            {user.name || "noname"} (@{user.username})
                        </span>{" "}
                        z tohto pracovného obdobia?
                    </p>
                </div>

                {/* Chyba */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Tlačidlá */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 px-4 py-2 border bg-neutral text-white rounded-lg font-medium transition-all"
                    >
                        Zrušiť
                    </button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="cursor-pointer flex-1 px-4 py-2  text-white rounded-lg font-medium cl-bg-decor transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isLoading ? "Odstraňujem..." : "Odstrániť"}
                    </button>
                </div>
            </div>
        </div>
    );
}
