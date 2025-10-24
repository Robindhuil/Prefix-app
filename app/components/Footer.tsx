"use client";
import Link from "next/link";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-black text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    <div className="flex-1 min-w-0">
                        <Link href="/" className="text-2xl font-bold text-red-600">
                            MyApp
                        </Link>
                        <p className="mt-3 text-sm text-gray-400 max-w-sm">
                            {t("footer.getUpdates")}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href="#newsletter"
                                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-700 rounded-md text-sm hover:bg-gray-900 transition"
                                aria-label={t("footer.newsletter")}
                            >
                                <Mail className="w-4 h-4" />
                                {t("footer.newsletter")}
                            </a>
                            <a href="https://github.com" aria-label="GitHub" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" aria-label="Twitter" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com" aria-label="LinkedIn" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex-1 grid grid-cols-2 gap-6 sm:grid-cols-3 md:w-1/3">
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/features" className="hover:underline">Features</Link></li>
                                <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
                                <li><Link href="/docs" className="hover:underline">Docs</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-3">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/about" className="hover:underline">About</Link></li>
                                <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                                <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-3">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/help" className="hover:underline">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter form */}
                    <div className="flex-1 md:w-1/3">
                        <h4 className="text-sm font-semibold mb-3">Get updates</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{t("footer.subscribeDesc")}</p>

                        <form
                            id="newsletter"
                            className="flex items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // tu pridaj fetch/post request na svoj backend
                                alert("Ďakujeme! (demo)");
                            }}
                        >
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="tvoj@email.sk"
                                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                            >
                                {t("footer.subscribe")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* bottom row */}
                <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} MyApp. {t("footer.rights")}</p>
                    <div className="mt-3 sm:mt-0 flex items-center gap-4">
                        <Link href="/terms" className="hover:underline">{t("footer.terms")}</Link>
                        <Link href="/security" className="hover:underline">{t("footer.security")}</Link>
                        <Link href="/contact" className="hover:underline">{t("footer.contact")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
