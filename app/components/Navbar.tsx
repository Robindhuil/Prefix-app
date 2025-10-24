"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/I18nProvider";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "@/app/theme/ThemeProvider";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white dark:bg-black shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-32">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={60}
                            height={60}
                            className="rounded-full border-2 border-red-600"
                        />
                    </Link>

                    {/* Desktop Links - Centered */}
                    <div className="hidden md:flex items-center justify-center flex-1 space-x-12 text-xl font-bold">
                        <Link href="/" className="relative group">
                            <span className="text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.home")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/about" className="relative group">
                            <span className="text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.about")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span className="text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.contact")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span className="text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.news")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span className="text-gray-800 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">{t("navbar.gallery")}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>

                    {/* Right controls: language, theme, login */}
                    <div className="hidden md:flex items-center space-x-4">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-11 h-11 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:opacity-90 transition"
                        >
                            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg rounded-lg transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                            <LogIn className="w-6 h-6" />
                            <span>{t("navbar.login")}</span>
                        </button>
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-gray-800 dark:text-gray-300 hover:text-red-500 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-white dark:bg-black shadow-lg border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80' : 'max-h-0'}`}>
                <div className="px-6 py-4 space-y-4">
                    <Link
                        href="/"
                        className="block text-gray-800 dark:text-gray-300 hover:text-red-500 transition-all duration-300 hover:pl-2 text-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.home")}
                    </Link>
                    <Link
                        href="/about"
                        className="block text-gray-800 dark:text-gray-300 hover:text-red-500 transition-all duration-300 hover:pl-2 text-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.about")}
                    </Link>
                    <Link
                        href="/contact"
                        className="block text-gray-800 dark:text-gray-300 hover:text-red-500 transition-all duration-300 hover:pl-2 text-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("navbar.contact")}
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex items-center justify-center w-11 h-11 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
                        >
                            {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <LanguageSelector />
                    </div>

                    <button className="flex items-center space-x-3 w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                        <LogIn className="w-6 h-6" />
                        <span>{t("navbar.login")}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
