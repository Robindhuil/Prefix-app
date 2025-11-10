"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useTheme } from "@/app/theme/ThemeProvider";
import Image from "next/image";

export default function HomePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="relative w-full max-w-7xl px-2 sm:px-4 lg:px-6 text-center">
        <div className="mb-12">
          <Image
            src={`/logos/${theme}/full_logo.svg`}
            alt="Full Logo"
            width={200}
            height={100}
            priority
            className="mx-auto w-auto h-auto transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight"
          style={{ color: "var(--colored-decor)" }}
        >
          {t("home.title")}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {t("home.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#get-started"
            className="px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(to right, var(--colored-decor), var(--colored-decor-hover))",
            }}
          >
            {t("home.getStarted")}
          </a>
          <a
            href="#learn-more"
            className="px-8 py-4 border rounded-lg font-semibold hover:scale-105 transition-all duration-300"
            style={{
              borderColor: "var(--colored-decor)",
              color: "var(--colored-decor)",
            }}
          >
            {t("home.learnMore")}
          </a>
        </div>
      </div>
    </section>

  );
}