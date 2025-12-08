"use client";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  title: ReactNode;
  subtitle: ReactNode;
  emailLabel: ReactNode;
  emailPlaceholder: string;
  cancelText: ReactNode;
  submitText: ReactNode;
  sendingText: ReactNode;
  email: string;
  onEmailChange: (value: string) => void;
  error?: string;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ForgottenPasswordModal({
  isOpen,
  title,
  subtitle,
  emailLabel,
  emailPlaceholder,
  cancelText,
  submitText,
  sendingText,
  email,
  onEmailChange,
  error,
  isLoading,
  onCancel,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => !isLoading && onCancel()} />
      <div className="relative w-full max-w-md px-4 sm:px-6">
        <div className="background backdrop-blur-xl rounded-2xl shadow-xl border-custom p-6">
          <h3 className="text-xl font-semibold text-color mb-2">{title}</h3>
          <p className="text-sm text-color opacity-70 mb-4">{subtitle}</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-color mb-1">
                {emailLabel}
              </label>
              <input
                id="forgot-email"
                name="forgot-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                placeholder={emailPlaceholder}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => !isLoading && onCancel()}
                className="cursor-pointer flex-1 py-2 border-custom rounded-lg text-color hover:bg-muted transition"
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer flex-1 py-2 cl-bg-decor text-white font-semibold rounded-lg shadow-md hover:cl-bg-decor-hover transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? sendingText : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
