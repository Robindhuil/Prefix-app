"use client";
import { AlertCircle, X } from "lucide-react";

type Props = {
  open: boolean;
  fileName?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void | boolean | { success: boolean; error?: string }>;
};

export default function DocumentDeleteModal({
  open,
  fileName,
  isDeleting = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  const handleConfirmClick = async () => {
    if (isDeleting) return;
    try {
      const res = await onConfirm();
      let success = false;

      if (typeof res === "boolean") {
        success = res;
      } else if (res && typeof res === "object" && "success" in res) {
        success = !!res.success;
      } else {
        success = true;
      }

      if (success) {
        onCancel(); // close modal after success
      }
      // Errors are handled by parent (toast/UI)
    } catch {
      // Errors are handled by parent (toast/UI)
    }
  };

  return (
    <div className="fixed inset-0 z-[9998]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isDeleting && onCancel()} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md px-4">
        <div className="bg-card rounded-2xl shadow-2xl border-custom p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-color">Odstrániť dokument</h3>
            <button
              className="cursor-pointer cl-text-decor hover:opacity-80 transition"
              onClick={() => !isDeleting && onCancel()}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-600 dark:text-red-400">
              Naozaj chcete odstrániť{fileName ? ` „${fileName}“` : " tento dokument"}? Táto akcia je nezvratná.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => !isDeleting && onCancel()}
              className="cursor-pointer flex-1 py-2 border-custom rounded-lg text-color hover:bg-muted transition disabled:opacity-70"
              disabled={isDeleting}
            >
              Zrušiť
            </button>
            <button
              type="button"
              onClick={handleConfirmClick}
              className="cursor-pointer flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? "Odstraňujem..." : "Odstrániť"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
