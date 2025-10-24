"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="text-center py-20">
      <h1 className="text-6xl font-bold text-red-600 mb-6">{t("home.title")}</h1>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">{t("home.subtitle")}</p>
      <div className="flex justify-center gap-4">
        <a
          href="#get-started"
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 hover:transform hover:scale-105"
        >
          {t("home.getStarted")}
        </a>
        <a
          href="#learn-more"
          className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-900 transition-all duration-300 hover:transform hover:scale-105"
        >
          {t("home.learnMore")}
        </a>
      </div>
    </section>
  );
}
