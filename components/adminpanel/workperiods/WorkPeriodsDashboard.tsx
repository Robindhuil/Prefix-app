// components/adminpanel/workperiods/WorkPeriodsDashboard.tsx
"use client";

import { useTranslation } from "@/app/i18n/I18nProvider";
import { useEffect, useState, useCallback, memo } from "react";
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
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

type Status = "active" | "upcoming" | "ended";
const getStatus = (start: string, end: string): Status => {
    const s = new Date(start);
    const e = new Date(end);
    if (s <= TODAY && TODAY <= e) return "active";
    if (TODAY < s) return "upcoming";
    return "ended";
};

const statusColors = {
    active: {
        titleColor: "text-green-700 dark:text-green-400",
        badgeBg: "bg-green-100 dark:bg-green-900",
        badgeText: "text-green-800 dark:text-green-200",
        label: "→ AKTÍVNE",
        borderColor: "border-green-500",
        ringColor: "ring-green-500",
        dotBg: "bg-green-500",
        dotPing: "bg-green-400",
    },
    upcoming: {
        titleColor: "text-yellow-700 dark:text-yellow-400",
        badgeBg: "bg-yellow-100 dark:bg-yellow-900",
        badgeText: "text-yellow-800 dark:text-yellow-200",
        label: "→ ČAKÁ",
        borderColor: "border-yellow-500",
        ringColor: "ring-yellow-500",
        dotBg: "bg-yellow-500",
        dotPing: "bg-yellow-400",
    },
    ended: {
        titleColor: "text-blue-700 dark:text-blue-400",
        badgeBg: "bg-blue-100 dark:bg-blue-900",
        badgeText: "text-blue-800 dark:text-blue-200",
        label: "→ UKONČENÉ",
        borderColor: "border-blue-500",
        ringColor: "ring-blue-500",
        dotBg: "bg-blue-500",
        dotPing: "bg-blue-400",
    },
};

// Memoizuj jednotlivé karty obdobia
const PeriodCard = memo(({
    period,
    status,
    isNew,
    isSelected,
    onClick,
    formatDate
}: {
    period: WorkPeriod;
    status: Status;
    isNew: boolean;
    isSelected: boolean;
    onClick: () => void;
    formatDate: (d: string) => string;
}) => {
    const colors = statusColors[status];
    
    return (
        <div
            className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                bg-card overflow-hidden
                ${colors.borderColor}
                ${isSelected ? `ring-2 ${colors.ringColor} ring-offset-2` : ""}
                hover:shadow-md hover:-translate-y-0.5
                ${isNew ? "animate-in slide-in-from-left-8 duration-500" : ""}
            `}
            onClick={onClick}
        >
            {isNew && <div className={`absolute inset-y-0 left-0 w-1.5 ${colors.dotBg} animate-pulse`} />}
            <div className="pr-10">
                <div className="flex justify-between items-start">
                    <h4 className={`font-semibold line-clamp-2 pr-8 ${colors.titleColor}`}>
                        {period.title}
                        <span className="ml-2 inline-block">
                            <span className="relative flex h-3 w-3">
                                {status === "active" && (
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}></span>
                                )}
                                {status === "upcoming" && (
                                    <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${colors.dotBg}`}></span>
                            </span>
                        </span>
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${colors.badgeBg} ${colors.badgeText}`}>
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
                    <span className={`ml-2 text-xs font-bold ${colors.titleColor}`}>{colors.label}</span>
                </p>
            </div>
        </div>
    );
});
PeriodCard.displayName = "PeriodCard";

export default function WorkPeriodsDashboard({
    onSelect,
    selectedId: externalSelectedId,
    sidebarOpen,
}: Props) {
    const { t } = useTranslation();
    const [periods, setPeriods] = useState<WorkPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlightId, setHighlightId] = useState<number | null>(null);

    const loadPeriods = useCallback(async () => {
        setLoading(true);
        const data = await getWorkPeriods();
        setPeriods(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadPeriods();
    }, [loadPeriods]);

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
    }, [loadPeriods]);

    const formatDate = useCallback((d: string) =>
        new Date(d).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }), []);

    const handleSelect = useCallback((id: number) => {
        onSelect?.(id);
    }, [onSelect]);

    // Group periods by status
    const groupedPeriods = {
        active: periods.filter(p => getStatus(p.startDate, p.endDate) === "active"),
        upcoming: periods.filter(p => getStatus(p.startDate, p.endDate) === "upcoming"),
        ended: periods.filter(p => getStatus(p.startDate, p.endDate) === "ended"),
    };

    return (
        <div className="w-full space-y-4">
            <h3 className="text-lg font-bold cl-text-decor flex items-center gap-2">
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
                <div className="space-y-6">
                    {/* Active Periods */}
                    {groupedPeriods.active.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Aktívne ({groupedPeriods.active.length})
                            </h4>
                            <div className="space-y-3">
                                {groupedPeriods.active.map((period) => (
                                    <PeriodCard
                                        key={period.id}
                                        period={period}
                                        status="active"
                                        isNew={highlightId === period.id}
                                        isSelected={externalSelectedId === period.id}
                                        onClick={() => handleSelect(period.id)}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Periods */}
                    {groupedPeriods.upcoming.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                Nadchádzajúce ({groupedPeriods.upcoming.length})
                            </h4>
                            <div className="space-y-3">
                                {groupedPeriods.upcoming.map((period) => (
                                    <PeriodCard
                                        key={period.id}
                                        period={period}
                                        status="upcoming"
                                        isNew={highlightId === period.id}
                                        isSelected={externalSelectedId === period.id}
                                        onClick={() => handleSelect(period.id)}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ended Periods */}
                    {groupedPeriods.ended.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                Ukončené ({groupedPeriods.ended.length})
                            </h4>
                            <div className="space-y-3">
                                {groupedPeriods.ended.map((period) => (
                                    <PeriodCard
                                        key={period.id}
                                        period={period}
                                        status="ended"
                                        isNew={highlightId === period.id}
                                        isSelected={externalSelectedId === period.id}
                                        onClick={() => handleSelect(period.id)}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}