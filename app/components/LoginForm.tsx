"use client";
import { useState } from "react";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
// import { AuthService, LoginCredentials } from "@/app/services/auth.service"; // 🔒 zatiaľ neaktívne

interface LoginFormData {
    username: string;
    password: string;
}

export default function LoginForm() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [formData, setFormData] = useState<LoginFormData>({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitError("");

        try {
            // 🔒 Dočasne vypnuté — backend autentifikácia sa pridá neskôr
            // const response = await AuthService.login(formData);
            // console.log('Login successful:', response);

            console.log("Simulované prihlásenie:", formData);
            // TODO: Implementovať skutočné prihlásenie po pridaní backendu

        } catch (error) {
            // setSubmitError(t(error instanceof Error ? error.message : 'login.serverError'));
            setSubmitError(t("login.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100/80 via-white/50 to-gray-50/80 dark:from-gray-900/80 dark:via-black/50 dark:to-gray-900/80">
            <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/50 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-linear-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("login.title")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {t("login.subtitle")}
                        </p>
                    </div>

                    {/* Error */}
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-red-700 dark:text-red-300">
                                {submitError}
                            </span>
                        </div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("login.username")}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50"
                                placeholder={t("login.usernamePlaceholder")}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("login.password")}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50"
                                    placeholder={t("login.passwordPlaceholder")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg"
                        >
                            {isLoading ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
