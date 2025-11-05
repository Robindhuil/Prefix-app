"use client";

import { useState } from "react";
import CreateWorkPeriodForm from "./CreateWorkPeriodForm";
import WorkPeriodsDashboard from "./WorkPeriodsDashboard";
import WorkPeriodsDashboardDetail from "./WorkPeriodsDashboardDetail";

export default function WorkPeriodsSection() {
    const [view, setView] = useState<"list" | "create">("list");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-[30rem] bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700
                    transition-transform duration-500 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-[85%]"}
                `}
            >
                {/* Horný riadok */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#600000]">Obdobia</h2>

                    <div className="flex items-center gap-3">
                        {/* Pridať nové obdobie */}
                        <button
                            onClick={() => {
                                setView("create");
                                setSidebarOpen(false);
                            }}
                            className="bg-[#600000] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-[#4b0000] transition-all"
                            title="Vytvoriť nové obdobie"
                        >
                            + Nové
                        </button>

                        {/* Šípka na zatváranie */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`
                                bg-[#600000] text-white rounded-full shadow-2xl border-2 border-white/30
                                p-3 hover:bg-[#4b0000] transition-all duration-500 ease-in-out
                                flex items-center justify-center cursor-pointer
                            `}
                            title={sidebarOpen ? "Skryť panel" : "Zobraziť panel"}
                        >
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="h-full overflow-y-auto p-6">
                    <WorkPeriodsDashboard
                        sidebarOpen={sidebarOpen}
                        onSelect={(id) => {
                            setSelectedId(id);
                            setView("list");
                            setSidebarOpen(false);
                        }}
                        selectedId={selectedId}
                    />
                </div>
            </aside>

            {/* TRČIACI PÁS */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-y-0 left-0 w-6 bg-gradient-to-r from-white/90 to-transparent dark:from-gray-800/80 cursor-pointer z-30"
                    onClick={() => setSidebarOpen(true)}
                    title="Otvoriť panel"
                />
            )}

            {/* HLAVNÝ OBSAH */}
            <main
                className={`flex-1 transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-[30rem]" : "ml-0"
                    }`}
            >
                <div
                    className={`mx-auto max-w-[1600px] transition-all duration-300 ${sidebarOpen ? "px-8" : "px-4 md:px-8"
                        }`}
                >
                    <div className="py-10">
                        {view === "create" ? (
                            <CreateWorkPeriodForm
                                onSuccess={() => {
                                    setView("list");
                                    setSidebarOpen(true);
                                }}
                            />
                        ) : (
                            <WorkPeriodsDashboardDetail periodId={selectedId} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
