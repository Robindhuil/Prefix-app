import 'flag-icons/css/flag-icons.min.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
            suppressHydrationWarning
        >
            <head />
            <body className="h-full flex flex-col min-h-screen">
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
