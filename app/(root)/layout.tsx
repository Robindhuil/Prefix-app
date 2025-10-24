import 'flag-icons/css/flag-icons.min.css';
import Navbar from "@/app/components/Navbar"
import Footer from "../components/Footer"
import { I18nProvider } from "@/app/i18n/I18nProvider";

export default function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="sk">
            <body className="flex flex-col min-h-screen overflow-y-auto bg-black text-white">
                {/* WRAPPER, ktorý vytvorí “scroll reveal” efekt */}
                <I18nProvider initial="sk">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto">
                        <main className="h-screen flex items-center justify-center">
                            {children}
                        </main>
                    </div>
                    <Footer />
                </I18nProvider>
            </body>
        </html>
    )
}