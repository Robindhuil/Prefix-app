"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import sk from "../locales/sk.json";
import en from "../locales/en.json";
import de from "../locales/de.json";
import nl from "../locales/nl.json";

type Locale = "sk" | "en" | "de" | "nl";
const translations: Record<Locale, any> = { sk, en, de, nl };

// typ pre interpoláciu – napr. { username: "Peter" }
type TranslationParams = Record<string, string | number>;

type I18nContextType = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (key: string, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextType>({
    locale: "sk",
    setLocale: () => { },
    t: (k) => k,
});

export function I18nProvider({
    children,
    initial = "sk" as Locale,
}: {
    children: React.ReactNode;
    initial?: Locale;
}) {
    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window !== "undefined") {
            const stored = (localStorage.getItem("locale") as Locale) || undefined;
            return stored ?? initial;
        }
        return initial;
    });

    useEffect(() => {
        localStorage.setItem("locale", locale);
        if (typeof document !== "undefined") {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const t = useMemo(
        () =>
            (key: string, params?: TranslationParams) => {
                const keys = key.split(".");
                let value: any = translations[locale];
                for (const k of keys) {
                    if (value == null) return key;
                    value = value[k];
                }

                if (typeof value !== "string") return key;

                // interpolácia {param}
                if (params) {
                    Object.entries(params).forEach(([paramKey, paramValue]) => {
                        value = value.replace(`{${paramKey}}`, String(paramValue));
                    });
                }

                return value;
            },
        [locale]
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export const useTranslation = () => useContext(I18nContext);
