"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";

export default function HomePage() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="text-center py-20 min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-6">{t("home.title")}</h1>
        <p className="text-[var(--foreground)] text-lg max-w-2xl mx-auto mb-8">
          {t("home.subtitle")}
        </p>
        <button
          onClick={toggleTheme}
          className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Current theme: {theme} | Toggle
        </button>
        <div className="flex justify-center gap-4">
          <a
            href="#get-started"
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 hover:transform hover:scale-105"
          >
            {t("home.getStarted")}
          </a>
          <a
            href="#learn-more"
            className="px-6 py-3 border border-gray-700 dark:border-gray-300 rounded-lg text-(--foreground) hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105"
          >
            {t("home.learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
}