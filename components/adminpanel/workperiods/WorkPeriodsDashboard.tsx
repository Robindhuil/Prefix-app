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
    sidebarOpen: boolean;
    onRequestEdit?: (period: WorkPeriod) => void; // NOVÉ: pre edit modal
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function WorkPeriodsDashboard({
    onSelect,
    selectedId: externalSelectedId,
    sidebarOpen,
    onRequestEdit,
}: Props) {
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

    useEffect(() => {
        loadPeriods();
    }, []);

    useEffect(() => {
        const handlerCreated = (e: Event) => {
            const id = (e as CustomEvent).detail;
            setHighlightId(id);
            loadPeriods();
            setTimeout(() => setHighlightId(null), 3000);
        };

        const handlerRefresh = () => {
            loadPeriods();
        };

        window.addEventListener("workperiod:created", handlerCreated);
        window.addEventListener("workperiod:updated", handlerRefresh);
        window.addEventListener("workperiod:deleted", handlerRefresh);

        return () => {
            window.removeEventListener("workperiod:created", handlerCreated);
            window.removeEventListener("workperiod:updated", handlerRefresh);
            window.removeEventListener("workperiod:deleted", handlerRefresh);
        };
    }, []);

    const isActive = (s: string, e: string) => new Date(s) <= TODAY && TODAY <= new Date(e);
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        <div
            className={`w-full space-y-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
                } lg:translate-x-0`}
        >
            <h3 className="text-xl font-bold cl-text-decor flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4h12v2H4V4zm0 4h12v8H4V8zm2 2v4h4v-4H6z" />
                </svg>
                {t("title") || "Pracovné obdobia"}
            </h3>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card h-28 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : periods.length === 0 ? (
                <p className="text-center py-8 input-text">
                    {t("noPeriods") || "Zatiaľ žiadne obdobia"}
                </p>
            ) : (
                <div className="space-y-3">
                    {periods.map((period) => {
                        const active = isActive(period.startDate, period.endDate);
                        const isNew = highlightId === period.id;
                        const isSelected = externalSelectedId === period.id;

                        return (
                            <div
                                key={period.id}
                                className={`
                                    relative p-4 rounded-lg border cursor-pointer transition-all
                                    bg-card overflow-hidden
                                    ${active ? "border-green-600 ring-2 ring-green-500" : "border-decor"}
                                    ${isSelected ? "ring-2 ring-[#600000] ring-offset-2" : ""}
                                    hover:shadow-md hover:-translate-y-0.5
                                    ${isNew ? "animate-in slide-in-from-left-8 duration-500" : ""}
                                `}
                                onClick={() => onSelect?.(period.id)}
                            >
                                {/* Zelený pruh pre nové */}
                                {isNew && <div className="absolute inset-y-0 left-0 w-1.5 bg-green-500 animate-pulse" />}
                                <div className="pr-10">
                                    <div className="flex justify-between items-start">
                                        <h4
                                            className={`font-semibold line-clamp-2 pr-8 ${active ? "text-green-700 dark:text-green-400" : "text-[#600000]"
                                                }`}
                                        >
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
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-[#600000]/10 text-[#600000]"
                                                }`}
                                        >
                                            #{period.id}
                                        </span>
                                    </div>

                                    <p className="text-sm input-text mt-2 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                                            />
                                        </svg>
                                        {formatDate(period.startDate)} – {formatDate(period.endDate)}
                                        {active && (
                                            <span className="ml-2 text-xs font-bold text-green-600">→ AKTÍVNE</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}