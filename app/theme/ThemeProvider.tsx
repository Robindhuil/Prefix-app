"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
    children,
    initialTheme,
}: {
    children: ReactNode;
    initialTheme: Theme;
}) {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    // Synchronizuj s localStorage a cookies
    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const finalTheme = saved || (prefersDark ? "dark" : "light");

        if (finalTheme !== theme) {
            setTheme(finalTheme);
            document.documentElement.classList.toggle("dark", finalTheme === "dark");
            document.cookie = `theme=${finalTheme}; path=/; max-age=31536000`;
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        // Aktualizuj CSS premenné
        document.documentElement.style.setProperty("--background", newTheme === "dark" ? "#12131b" : "#ffffff");
        document.documentElement.style.setProperty("--foreground", newTheme === "dark" ? "#b3b3b3" : "#282828");
        document.documentElement.style.setProperty("--card-bg", newTheme === "dark" ? "rgba(7, 10, 21, 0.8)" : "#d0cece");
        document.documentElement.style.setProperty("--text-color", newTheme === "dark" ? "#ffffff" : "#000000");
        document.documentElement.style.setProperty("--colored-decor", newTheme === "dark" ? "#600000" : "#9e0a0a");
        document.documentElement.style.setProperty("--colored-decor-hover", newTheme === "dark" ? "#4b0000" : "#7a0808");

        localStorage.setItem("theme", newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};