"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/I18nProvider";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLoginClick = () => {
        router.push('/login');
    };

    return (
        <nav className="bg-linear-to-r from-gray-100/90 to-white/90 dark:from-gray-900/90 dark:to-black/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo - Very Left */}
                    <Link href="/" className="flex items-center pl-2 sm:pl-4">
                        <Image
                            src={theme === 'light' ? '/logos/light/logo_name.svg' : '/logos/dark/logo_name.svg'}
                            alt="Logo"
                            width={180}
                            height={60}
                            priority
                            className="h-14 w-auto transition-transform duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Links - Centered */}
                    <div className="hidden md:flex flex-1 items-center justify-center space-x-10 text-base font-medium">
                        <Link href="/" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.home")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/about" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.about")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.contact")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/news" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.news")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                        <Link href="/gallery" className="relative group">
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.gallery")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                        </Link>
                    </div>

                    {/* Right Controls - Very Right */}
                    <div className="hidden md:flex items-center space-x-4 pr-2 sm:pr-4">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-teal-500/50 dark:hover:bg-teal-600/50 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleLoginClick}
                            className="flex items-center space-x-2 bg-linear-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>{t("navbar.login")}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110 pr-2 sm:pr-4"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-linear-to-r from-gray-100/95 to-white/95 dark:from-gray-900/95 dark:to-black/95 backdrop-blur-md shadow-lg border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-4 py-4 space-y-3">
                    <Link
                        href="/"
                        className="block text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 hover:pl-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.home")}
                    </Link>
                    <Link
                        href="/about"
                        className="block text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 hover:pl-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.about")}
                    </Link>
                    <Link
                        href="/contact"
                        className="block text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 hover:pl-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.contact")}
                    </Link>
                    <Link
                        href="/news"
                        className="block text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 hover:pl-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.news")}
                    </Link>
                    <Link
                        href="/gallery"
                        className="block text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-all duration-300 hover:pl-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.gallery")}
                    </Link>
                    <div className="flex items-center gap-4 pt-2">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-teal-500/50 dark:hover:bg-teal-600/50 transition-all duration-300 hover:scale-110"
                        >
                            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                    <button className="flex items-center space-x-2 w-full bg-linear-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <LogIn className="w-5 h-5" />
                        <span>{t("navbar.login")}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}