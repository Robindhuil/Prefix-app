// app/dashboard/[id]/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
            {/* MOBILNÉ MENU – skryté, vysunie sa */}
            <input type="checkbox" id="nav-toggle" className="hidden peer" />
            <label
                htmlFor="nav-toggle"
                className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg cursor-pointer"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </label>

            {/* SIDEBAR */}
            <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-2xl transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-md">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#600000] mb-8">Dashboard</h2>
                    <nav className="space-y-4">
                        <a href="#" className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#600000] transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profil
                        </a>
                        <a href="#" className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#600000] transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Priradenia
                        </a>
                        <a href="/logout" className="flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-800 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Odhlásiť sa
                        </a>
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-0 pt-16 md:pt-0 pb-10">
                <div className="max-w-6xl mx-auto px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}