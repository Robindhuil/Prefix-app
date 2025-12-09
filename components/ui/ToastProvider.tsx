"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
};

type ToastContextType = {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType = "info", duration = 4000) => {
        setToasts((prev) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newToast = { id, message, type, duration };

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }

            return [...prev, newToast];
        });
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case "info":
            default:
                return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        }
    };

    const getColors = (type: ToastType) => {
        switch (type) {
            case "success":
                return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300";
            case "error":
                return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
            case "warning":
                return "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";
            case "info":
            default:
                return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300";
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container – locknutý vpravo hore pod hlavičkou */}
            <div className="fixed top-[120px] right-4 z-10000 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast, index) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="pointer-events-auto"
                        >
                            <div
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl backdrop-blur-md border min-w-80 max-w-md ${getColors(
                                    toast.type
                                )}`}
                            >
                                {getIcon(toast.type)}
                                <span className="font-medium text-sm flex-1">{toast.message}</span>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="text-current opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};