import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// app/dashboard/[id]/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
            <DashboardSidebar />

            {/* HLAVNÝ OBSAH – ŠIROKÝ, ALE S PEKNÝMI OKRAJMI */}
            <main className="flex-1 pt-5 md:pt-0 pb-24">
                <div className="w-full">
                    {/* MAX ŠÍRKA + PADDING + ZAOBLENÉ OKRAJE */}
                    <div className="max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
                        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}