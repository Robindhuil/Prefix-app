"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, LogOut, Sun, Moon, Shield, Home } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/I18nProvider";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";
    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLoginClick = () => router.push("/login");
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <nav className="bg-navbar backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-custom">
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-20 md:h-24">

                    {/* Logo */}
                    <Link href="/" className="flex items-center pl-2 sm:pl-4">
                        <Image
                            src={theme === "light" ? "/logos/light/logo_name.svg" : "/logos/dark/logo_name.svg"}
                            alt="Logo"
                            width={220}
                            height={80}
                            priority
                            className="h-15 w-auto transition-transform duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex flex-1 items-center justify-center space-x-12 text-xl font-semibold">
                        {["home", "about", "contact", "news", "gallery"].map((key) => (
                            <Link
                                key={key}
                                href={`/${key === "home" ? "" : key}`}
                                className="underline-anim"
                            >
                                <span className="text-hover-decor">
                                    {t(`navbar.${key}`)}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div className="hidden md:flex items-center space-x-4 pr-2 sm:pr-4">
                        <LanguageSelector />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex bg-neutral cursor-pointer items-center justify-center w-12 h-12 rounded-full bg-card/80 text-white hover:bg-decor/20 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>

                        {session ? (
                            <div className="flex items-center gap-4">
                                {/* Admin Panel */}
                                {isAdmin && (
                                    <Link
                                        href="/adminpanel"
                                        className="flex bg-neutral items-center space-x-2 text-white px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105"
                                    >
                                        <Shield className="w-5 h-5" />
                                        <span>Admin</span>
                                    </Link>
                                )}

                                {/* Dashboard Button */}
                                <Link
                                    href={`/dashboard/${session.user.id}`}
                                    className="flex items-center space-x-2 cl-bg-decor text-white px-5 py-3 rounded-lg text-lg font-bold transition-all duration-300 hover:cl-bg-decor-hover hover:shadow-xl"
                                >
                                    <Home className="w-6 h-6" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Sign Out */}
                                <button
                                    onClick={handleSignOut}
                                    className="cursor-pointer flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <LogOut className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 cl-bg-decor hover:cl-bg-decor-hover text-white px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <LogIn className="w-6 h-6" />
                                <span>{t("navbar.login")}</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-color hover:text-decor focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110 pr-2 sm:pr-4"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-navbar/95 backdrop-blur-md shadow-lg border-t border-custom/50 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                <div className="px-4 py-4 space-y-3">
                    {session && (
                        <>
                            <Link
                                href={`/dashboard/${session.user.id}`}
                                className="block text-color hover:text-decor transition-all duration-300 hover:pl-2 text-lg font-semibold items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <Home className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/adminpanel"
                                    className="block text-color hover:text-decor transition-all duration-300 hover:pl-2 text-lg font-semibold items-center gap-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Shield className="w-5 h-5" />
                                    <span>Admin</span>
                                </Link>
                            )}
                        </>
                    )}

                    {["home", "about", "contact", "news", "gallery"].map((key) => (
                        <Link
                            key={key}
                            href={`/${key === "home" ? "" : key}`}
                            className="block text-color hover:text-decor transition-all duration-300 hover:pl-2 text-lg font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            {t(`navbar.${key}`)}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 pt-2">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-card/80 text-color hover:bg-decor/20 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                    </div>

                    {session ? (
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-center space-x-2 cl-bg-decor hover:cl-bg-decor-hover text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <LogOut className="w-6 h-6" />
                            <span>{t("navbar.signOut")}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex w-full items-center justify-center space-x-2 cl-bg-decor hover:cl-bg-decor-hover text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <LogIn className="w-6 h-6" />
                            <span>{t("navbar.login")}</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}