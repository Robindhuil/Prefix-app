import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class', // Pridajte túto riadku
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-open-sans)"],
                mono: ["var(--font-courier-prime)"],
            },
        },
    },
    plugins: [],
};

export default config;