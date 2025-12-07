"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: Theme }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return initialTheme || "light";
        const saved = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return saved || (prefersDark ? "dark" : "light");
    });

    // Apply theme to DOM after mount
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.body.classList.add("hydrated");
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
