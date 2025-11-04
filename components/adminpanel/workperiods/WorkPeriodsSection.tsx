// components/adminpanel/workperiods/WorkPeriodsSection.tsx
"use client";

import { useState } from "react";
import CreateWorkPeriodForm from "./CreateWorkPeriodForm";
import WorkPeriodsDashboard from "./WorkPeriodsDashboard"; // ← NOVÉ

export default function WorkPeriodsSection() {
    const [view, setView] = useState<"list" | "create">("list");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ← NAĽAVO: Dashboard s kartami */}
            <div className="lg:col-span-1">
                <WorkPeriodsDashboard />
            </div>

            {/* ← NAPRAVO: Hlavný obsah */}
            <div className="lg:col-span-3">
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#600000] dark:text-[#600000]">
                            Pracovné obdobia
                        </h2>
                        <button
                            onClick={() => setView(view === "list" ? "create" : "list")}
                            className="bg-[#600000] text-white px-6 py-2 rounded-lg hover:bg-[#4b0000] transition"
                        >
                            {view === "list" ? "+ Nová karta" : "← Späť na zoznam"}
                        </button>
                    </div>

                    {view === "create" && <CreateWorkPeriodForm onSuccess={() => setView("list")} />}
                    {view === "list" && (
                        <p className="text-gray-600 dark:text-gray-400">
                            Vyberte obdobie zľava pre detail alebo vytvorte nové.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}