"use client";

import { useState, useEffect } from "react";
import WorkPeriodsDashboard from "./WorkPeriodsDashboard";
import WorkPeriodsDashboardDetail from "./WorkPeriodsDashboardDetail";
import WorkPeriodModal from "./WorkPeriodModal";
import { Plus } from "lucide-react";

type PeriodPreview = {
    id: number;
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
};

export default function WorkPeriodsSection() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Dáta pre edit modal – naplníme ich len keď je vybrané obdobie
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodPreview | null>(null);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    // ---------------------------------------------------------
    // 1. Po výbere v zozname uložíme preview dát pre edit
    // ---------------------------------------------------------
    const handleSelect = (id: number) => {
        setSelectedId(id);
        setSidebarOpen(false);
    };

    // ---------------------------------------------------------
    // 2. Otvorenie EDIT modalu
    // ---------------------------------------------------------
    const openEditModal = (period: PeriodPreview) => {
        setSelectedPeriod(period);
        setModalMode("edit");
        setModalOpen(true);
    };

    // ---------------------------------------------------------
    // 3. Po úspešnom CREATE / UPDATE zavrieme modal
    // ---------------------------------------------------------
    const closeModal = () => {
        setModalOpen(false);
        setSelectedPeriod(null);
    };

    // ---------------------------------------------------------
    // 4. Listener na refresh preview dát po editácii
    // ---------------------------------------------------------
    useEffect(() => {
        const handler = () => {
            // Po update/detail reloadu si z detailu vyžiadame čerstvé dáta
            // (Detail ich už má, tak ich len prepošleme)
            window.dispatchEvent(new CustomEvent("workperiod:requestPreview"));
        };
        window.addEventListener("workperiod:updated", handler);
        return () => window.removeEventListener("workperiod:updated", handler);
    }, []);

    return (
        <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-120 bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700
          transition-transform duration-500 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-[85%]"}
        `}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-[#600000]">Obdobia</h2>

                    <div className="flex items-center gap-3">
                        {/* CREATE */}
                        <button
                            onClick={() => {
                                setModalMode("create");
                                setModalOpen(true);
                            }}
                            className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Nové obdobie
                        </button>

                        {/* Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="bg-[#600000] text-white rounded-full shadow-2xl border-2 border-white/30 p-3 hover:bg-[#4b0000] transition-all duration-500"
                            title={sidebarOpen ? "Skryť panel" : "Zobraziť panel"}
                        >
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`}
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
                        onSelect={handleSelect}
                        selectedId={selectedId}
                        // Pošleme callback, aby dashboard vedel, že má poslať preview
                        onRequestEdit={openEditModal}
                    />
                </div>
            </aside>

            {/* Trčiaci pás */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-y-0 left-0 w-6 bg-linear-to-r from-white/90 to-transparent dark:from-gray-800/80 cursor-pointer z-30"
                    onClick={() => setSidebarOpen(true)}
                    title="Otvoriť panel"
                />
            )}

            {/* HLAVNÝ OBSAH */}
            <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? "ml-120" : "ml-0"}`}>
                <div className={`mx-auto max-w-[1600px] transition-all duration-300 ${sidebarOpen ? "px-8" : "px-4 md:px-8"}`}>
                    <div className="py-10">
                        <WorkPeriodsDashboardDetail
                            periodId={selectedId}
                            onEdit={openEditModal}
                        />
                    </div>
                </div>
            </main>

            {/* UNIVERZÁLNY MODAL */}
            <WorkPeriodModal
                isOpen={modalOpen}
                onClose={closeModal}
                mode={modalMode}
                initialData={modalMode === "edit" ? selectedPeriod ?? undefined : undefined}
            />
        </div>
    );
}