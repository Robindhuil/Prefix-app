import 'flag-icons/css/flag-icons.min.css';
import Navbar from "@/components/Navbar";
import Footer from "../../components/Footer";
import { I18nProvider } from "@/app/i18n/I18nProvider";
import { ThemeProvider } from "@/app/theme/ThemeProvider";
import { ToastProvider } from '@/components/ui/ToastProvider';
import { getThemeFromCookies } from "@/app/theme/GetThemeFromCookies";

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const theme = await getThemeFromCookies();

    return (
        <html
            lang="en"
            className={`h-full ${theme === "dark" ? "dark" : ""}`}
            style={{
                "--background": theme === "dark" ? "#12131b" : "#ffffff",
                "--foreground": theme === "dark" ? "#b3b3b3" : "#282828",
                "--navbar-bg": "linear-gradient(to right, rgba(15, 26, 45, 0.95), rgba(0, 0, 0, 0.95))",
                "--card-bg": theme === "dark" ? "rgba(7, 10, 21, 0.8)" : "#d0cece",
                "--text-color": theme === "dark" ? "#ffffff" : "#000000",
                "--colored-decor": theme === "dark" ? "#600000" : "#9e0a0a",
                "--colored-decor-hover": theme === "dark" ? "#4b0000" : "#7a0808",
            } as React.CSSProperties}
            suppressHydrationWarning
        >
            <head />
            <body className="h-full flex flex-col min-h-screen">
                {/* Hydratácia – skry obsah do načítania */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `document.body.classList.add('hydrated');`,
                    }}
                />

                <ThemeProvider initialTheme={theme}>
                    <I18nProvider initial="sk">
                        <ToastProvider>
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="flex-1">{children}</main>
                                <Footer />
                            </div>
                        </ToastProvider>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}