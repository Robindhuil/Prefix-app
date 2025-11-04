// components/adminpanel/workperiods/WorkPeriodsDashboard.tsx
"use client";

import { useTranslation } from "@/app/i18n/I18nProvider";
import { useEffect, useState } from "react";
import { getWorkPeriods } from "@/app/(root)/adminpanel/workperiods/actions/getWorkPeriodsAction";

type WorkPeriod = {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    description: string | null;
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function WorkPeriodsDashboard() {
    const { t } = useTranslation();
    const [periods, setPeriods] = useState<WorkPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [justAddedId, setJustAddedId] = useState<number | null>(null); // ← NOVÉ

    const loadPeriods = async () => {
        setLoading(true);
        const data = await getWorkPeriods();
        setPeriods(data);

        // Ak bola nová karta pridaná, označ ju na 2s
        const urlParams = new URLSearchParams(window.location.search);
        const newId = urlParams.get("new");
        if (newId) {
            setJustAddedId(parseInt(newId));
            setTimeout(() => setJustAddedId(null), 2000);
            // Odstráň parameter z URL
            window.history.replaceState({}, "", window.location.pathname);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadPeriods();
    }, []);

    useEffect(() => {
        const handler = () => loadPeriods();
        window.addEventListener("workperiod:created", handler);
        return () => window.removeEventListener("workperiod:created", handler);
    }, []);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });

    const isActive = (s: string, e: string) => new Date(s) <= TODAY && TODAY <= new Date(e);

    return (
        <div className="w-full space-y-4">
            <h3 className="text-xl font-bold text-[#600000] dark:text-[#600000] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4h12v2H4V4zm0 4h12v8H4V8zm2 2v4h4v-4H6z" />
                </svg>
                {t("title")}
            </h3>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 h-28 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : periods.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">{t("noPeriods")}</p>
            ) : (
                <div className="space-y-3">
                    {periods.map(period => {
                        const active = isActive(period.startDate, period.endDate);
                        const isNew = justAddedId === period.id;

                        return (
                            <div
                                key={period.id}
                                onClick={() => setSelectedId(period.id)}
                                className={`
                  p-4 rounded-lg border cursor-pointer transition-all relative overflow-hidden
                  bg-white dark:bg-gray-800
                  ${active
                                        ? "border-green-600 ring-2 ring-green-500 ring-offset-2 shadow-lg"
                                        : "border-gray-300 dark:border-gray-600 hover:border-[#600000]"
                                    }
                  hover:shadow-md hover:-translate-y-0.5
                  ${isNew ? "animate-in slide-in-from-left-4 duration-500" : ""}
                `}
                            >
                                {/* NOVÁ KARTA → ZELENÝ PRUH */}
                                {isNew && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 animate-pulse" />
                                )}

                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold line-clamp-2 ${active ? "text-green-700 dark:text-green-400" : "text-[#600000]"}`}>
                                        {period.title}
                                        {active && (
                                            <span className="ml-2 inline-block">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                </span>
                                            </span>
                                        )}
                                    </h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-800" : "bg-[#600000]/10 text-[#600000]"}`}>
                                        #{period.id}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
                                    </svg>
                                    {formatDate(period.startDate)} – {formatDate(period.endDate)}
                                    {active && <span className="ml-2 text-xs font-bold text-green-600">→ AKTÍVNE</span>}
                                </p>

                                {selectedId === period.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        {period.description ? (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{period.description}</p>
                                        ) : (
                                            <p className="text-sm italic text-gray-500">{t("noDescription")}</p>
                                        )}
                                        <div className="mt-3 flex gap-2">
                                            <button className={`text-xs px-3 py-1.5 rounded transition ${active ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#600000] hover:bg-[#4b0000] text-white"}`}>
                                                {t("viewDocuments")}
                                            </button>
                                            <button className="text-xs border border-[#600000] text-[#600000] px-3 py-1.5 rounded hover:bg-[#600000]/5 transition">
                                                {t("edit")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}