"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
import Image from "next/image";

export default function HomePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-b from-gray-100/80 to-white/80 dark:from-gray-900/80 dark:to-black/80">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:40px_40px] opacity-5"></div>
      <div className="relative w-full max-w-7xl px-2 sm:px-4 lg:px-6 text-center">
        <div className="mb-12">
          <Image
            src={theme === 'light' ? '/logos/light/full_logo.svg' : '/logos/dark/full_logo.svg'}
            alt="Full Logo"
            width={400}
            height={200}
            priority
            className="mx-auto w-auto h-auto transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-red-600 mb-6 tracking-tight">{t("home.title")}</h1>
        <p className="text-lg sm:text-xl text-(--foreground) max-w-3xl mx-auto mb-10 leading-relaxed">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#get-started"
            className="px-8 py-4 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t("home.getStarted")}
          </a>
          <a
            href="#learn-more"
            className="px-8 py-4 border border-gray-300 dark:border-gray-700 text-(--foreground) rounded-lg font-semibold hover:bg-teal-500/20 dark:hover:bg-teal-600/20 hover:scale-105 transition-all duration-300"
          >
            {t("home.learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
}