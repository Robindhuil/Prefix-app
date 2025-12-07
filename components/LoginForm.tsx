"use client";
import { useState, useEffect } from "react";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/ToastProvider";

export default function LoginForm() {
    const { t } = useTranslation();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { addToast } = useToast();

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

        if (!username.trim() || password.length < 6) {
            setError(t("login.validationError"));
            setIsLoading(false);
            return;
        }

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            if (result.error === "ACCOUNT_DEACTIVATED") {
                setError(t("login.accountDeactivated"));
            } else {
                setError(t("login.serverError"));
            }
            setIsLoading(false);
        } else {
            router.push("/");
        }

        if (result?.ok) {
            addToast(t("toast.userLogged"), "success");
        } else {
            addToast(t("toast.UserLoginError"), "error");
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

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                        </div>
                    )}

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
        </div>
    );
}