"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Trash2, X } from "lucide-react";

export default function WorkPeriodDeleteModal({
    isOpen,
    onClose,
    title,
    onConfirm,
    isDeleting,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onConfirm: () => void;
    isDeleting: boolean;
}) {
    // Scroll lock
    useEffect(() => {
        if (!isOpen) return;
        const scrollY = window.scrollY;
        document.documentElement.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        const gap = window.innerWidth - document.documentElement.clientWidth;
        if (gap > 0) document.documentElement.style.paddingRight = `${gap}px`;
        return () => {
            document.documentElement.style.overflow = "";
            document.documentElement.style.paddingRight = "";
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            if (top) window.scrollTo(0, -parseInt(top || "0", 10));
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                onClick={handleBackdropClick}
            />
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] p-4"
                onClick={handleBackdropClick}
            >
                <div
                    className="background rounded-xl p-6 max-w-md w-screen shadow-2xl border-decor relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 interactive-text transition-colors cursor-pointer"
                        disabled={isDeleting}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 cl-text-color mb-4">
                        <AlertCircle className="w-8 h-8" />
                        <h3 className="text-xl font-bold">Odstrániť obdobie?</h3>
                    </div>
                    <p className="input-text mb-6">
                        Naozaj chceš odstrániť obdobie <strong>{title}</strong>?<br />
                        <span className="text-sm">Toto je nevratná operácia.</span>
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-5 py-2.5 bg-neutral rounded-lg transition cursor-pointer"
                        >
                            Zrušiť
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-5 py-2.5 cl-bg-decor cursor-pointer text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? "Odstraňuje sa..." : "Odstrániť"}
                            {!isDeleting && <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        typeof document !== "undefined" ? document.body : ({} as HTMLElement)
    );
}
