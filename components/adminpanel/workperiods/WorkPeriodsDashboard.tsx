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

type Props = {
    onSelect?: (id: number) => void;
    selectedId?: number | null;
    sidebarOpen: boolean;   // ← NOVÉ
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function WorkPeriodsDashboard({ onSelect, selectedId: externalSelectedId, sidebarOpen }: Props) {
    const { t } = useTranslation();
    const [periods, setPeriods] = useState<WorkPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlightId, setHighlightId] = useState<number | null>(null);

    const loadPeriods = async () => {
        setLoading(true);
        const data = await getWorkPeriods();
        setPeriods(data);
        setLoading(false);
    };

    useEffect(() => { loadPeriods(); }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            const id = (e as CustomEvent).detail;
            setHighlightId(id);
            loadPeriods();
            setTimeout(() => setHighlightId(null), 3000);
        };
        window.addEventListener("workperiod:created", handler);
        return () => window.removeEventListener("workperiod:created", handler);
    }, []);

    const isActive = (s: string, e: string) => new Date(s) <= TODAY && TODAY <= new Date(e);
    const formatDate = (d: string) => new Date(d).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        // ← JEDINÁ ZMENA: pridaj triedu pre slide
        <div className={`w-full space-y-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0`}>
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
                        const isNew = highlightId === period.id;
                        const isSelected = externalSelectedId === period.id;

                        return (
                            <div
                                key={period.id}
                                onClick={() => onSelect?.(period.id)}
                                className={`
                                    p-4 rounded-lg border cursor-pointer transition-all relative overflow-hidden
                                    bg-white dark:bg-gray-800
                                    ${active ? "border-green-600 ring-2 ring-green-500" : "border-gray-300 dark:border-gray-600"}
                                    ${isSelected ? "ring-2 ring-[#600000] ring-offset-2" : ""}
                                    hover:shadow-md hover:-translate-y-0.5
                                    ${isNew ? "animate-in slide-in-from-left-8" : ""}
                                `}
                            >
                                {isNew && <div className="absolute inset-y-0 left-0 w-1.5 bg-green-500 animate-pulse" />}

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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}