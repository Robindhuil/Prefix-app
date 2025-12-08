"use client";
import { useState, useEffect } from "react";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
    // Server action passed from page
    forgotPasswordAction: (email: string) => Promise<{
        success?: boolean;
        error?: string;
        errorKey?: string;
        simulated?: boolean;
        previewUrl?: string;
        // 👇 optional developer helpers
        token?: string;
        resetUrl?: string;
    }>;
    // Optional: signInAction prop if you later unify calls
    // signInAction?: (formData: FormData) => Promise<any>;
};

export default function LoginForm({ forgotPasswordAction }: Props) {
    const { t } = useTranslation();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

    // Forgot password modal state
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState("");

    // Store reset link for quick access in dev/simulated mode
    const [devResetLink, setDevResetLink] = useState<string>("");

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === "authenticated") {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Client-side validations
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            setError(t("login.errors.usernameRequired"));
            addToast(t("toast.UserLoginError"), "error");
            setIsLoading(false);
            return;
        }
        if (!password) {
            setError(t("login.errors.passwordRequired"));
            addToast(t("toast.UserLoginError"), "error");
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t("login.errors.passwordTooShort"));
            addToast(t("toast.UserLoginError"), "error");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                username: trimmedUsername,
                password,
                redirect: false,
            });

            if (result?.error) {
                // Map server error codes to i18n messages
                const errorKeyMap: Record<string, string> = {
                    ACCOUNT_DEACTIVATED: "login.accountDeactivated",
                    INVALID_CREDENTIALS: "login.errors.invalidCredentials",
                    USER_NOT_FOUND: "login.errors.userNotFound",
                    USERNAME_REQUIRED: "login.errors.usernameRequired",
                    PASSWORD_REQUIRED: "login.errors.passwordRequired",
                    PASSWORD_TOO_SHORT: "login.errors.passwordTooShort",
                    SERVER_ERROR: "login.serverError",
                };
                const msgKey = errorKeyMap[result.error] || "login.serverError";
                setError(t(msgKey));
                addToast(t("toast.UserLoginError"), "error");
                setIsLoading(false);
                return;
            }

            addToast(t("toast.userLogged"), "success");
            router.push("/");
        } catch {
            setError(t("login.serverError"));
            addToast(t("toast.UserLoginError"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsForgotLoading(true);
        setForgotError("");
        setDevResetLink("");

        const email = forgotEmail.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setForgotError(t("login.errors.emailRequired"));
            addToast(t("toast.UserLoginError"), "error");
            setIsForgotLoading(false);
            return;
        }
        if (!emailRegex.test(email)) {
            setForgotError(t("login.errors.emailInvalid"));
            addToast(t("toast.UserLoginError"), "error");
            setIsForgotLoading(false);
            return;
        }

        try {
            const res = await forgotPasswordAction(email);

            if (res?.error) {
                setForgotError(t(res.errorKey || "login.serverError"));
                addToast(t("toast.UserLoginError"), "error");
            } else {
                // Success and simulated handling
                const isSim = !!res?.simulated;
                if (isSim) {
                    const msg = res.previewUrl
                        ? t("toast.passwordResetEmailSimulatedWithPreview")
                        : t("toast.passwordResetEmailSimulated");
                    addToast(msg, "info");
                    // Dev: expose a direct reset URL if the action provides token/resetUrl
                    const url =
                        res.resetUrl ||
                        (res.token ? `/reset-password?token=${encodeURIComponent(res.token)}&email=${encodeURIComponent(email)}` : "");
                    if (url) {
                        setDevResetLink(url);
                        // eslint-disable-next-line no-console
                        console.log("Dev reset link:", url);
                    }
                } else {
                    addToast(t("toast.passwordResetEmailSent"), "success");
                }
                setIsForgotOpen(false);
                setForgotEmail("");
            }
        } catch {
            setForgotError(t("login.serverError"));
            addToast(t("toast.UserLoginError"), "error");
        } finally {
            setIsForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Gradient pozadie – môžeš neskôr nahradiť CSS premennou */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 -z-10"></div>

            <div className="relative w-full max-w-md px-4 sm:px-6 lg:px-8">
                <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border-custom p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 cl-bg-decor rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-color mb-2">
                            {t("login.title")}
                        </h2>
                        <p className="text-color opacity-70">{t("login.subtitle")}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-color mb-1">
                                {t("login.username")}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                                placeholder={t("login.usernamePlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-color mb-1">
                                {t("login.password")}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-12 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                                    placeholder={t("login.passwordPlaceholder")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-color opacity-60 hover:opacity-100 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={() => setIsForgotOpen(true)}
                                className="cursor-pointer text-color opacity-80 hover:opacity-100 underline"
                                disabled={isLoading}
                            >
                                {t("login.forgotPassword")}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer w-full py-3 cl-bg-decor text-white font-semibold rounded-lg shadow-md hover:cl-bg-decor-hover transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {isForgotOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => !isForgotLoading && setIsForgotOpen(false)} />
                    <div className="relative w-full max-w-md px-4 sm:px-6">
                        <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border-custom p-6">
                            <h3 className="text-xl font-semibold text-color mb-2">
                                {t("login.forgotPasswordTitle")}
                            </h3>
                            <p className="text-sm text-color opacity-70 mb-4">
                                {t("login.forgotPasswordSubtitle")}
                            </p>

                            {forgotError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm text-red-600 dark:text-red-400">{forgotError}</span>
                                </div>
                            )}

                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="forgot-email" className="block text-sm font-medium text-color mb-1">
                                        {t("login.email")}
                                    </label>
                                    <input
                                        id="forgot-email"
                                        name="forgot-email"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border-custom input-bg input-text focus-ring focus-border focus:outline-none transition-all"
                                        placeholder={t("login.emailPlaceholder")}
                                        disabled={isForgotLoading}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => !isForgotLoading && setIsForgotOpen(false)}
                                        className="cursor-pointer flex-1 py-2 border-custom rounded-lg text-color hover:bg-muted transition"
                                        disabled={isForgotLoading}
                                    >
                                        {t("common.cancel")}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isForgotLoading}
                                        className="cursor-pointer flex-1 py-2 cl-bg-decor text-white font-semibold rounded-lg shadow-md hover:cl-bg-decor-hover transition disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isForgotLoading ? t("common.sending") : t("login.sendResetEmail")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Surface dev reset link if available */}
            {devResetLink && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border-custom rounded-lg shadow p-3 text-sm">
                    <span className="mr-2 text-color opacity-70">Dev reset link (should include ?token=...):</span>
                    <a href={devResetLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                        {devResetLink}
                    </a>
                </div>
            )}
        </div>
    );
}