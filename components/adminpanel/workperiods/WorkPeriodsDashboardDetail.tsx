// components/adminpanel/workperiods/WorkPeriodsDashboardDetail.tsx
"use client";

import { useTranslation } from "@/app/i18n/I18nProvider";
import { useEffect, useState } from "react";
import { getWorkPeriodDetail } from "@/app/(root)/adminpanel/workperiods/actions/getWorkPeriodDetailAction";

type Detail = {
    id: number;
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
    createdAt: string;
    requirements: { profession: string; countNeeded: number }[];
    assignments: {
        user: { id: number; username: string; name: string | null };
        fromDate: string;
        toDate: string;
    }[];
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function WorkPeriodsDashboardDetail({ periodId }: { periodId: number | null }) {
    const { t } = useTranslation();
    const [detail, setDetail] = useState<Detail | null>(null);
    const [loading, setLoading] = useState(true);

    const loadDetail = async () => {
        if (!periodId) {
            setDetail(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await getWorkPeriodDetail(periodId);
        setDetail(data); // ← string dátumy → OK
        setLoading(false);
    };

    useEffect(() => { loadDetail(); }, [periodId]);

    useEffect(() => {
        const handler = () => loadDetail();
        window.addEventListener("workperiod:created", handler);
        window.addEventListener("assignment:changed", handler);
        return () => {
            window.removeEventListener("workperiod:created", handler);
            window.removeEventListener("assignment:changed", handler);
        };
    }, [periodId]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (!periodId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p className="text-xl">{t("selectPeriod") || "Vyberte obdobie"}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (!detail) return <p className="text-red-600">Obdobie sa nenašlo</p>;

    const active = new Date(detail.startDate) <= TODAY && TODAY <= new Date(detail.endDate);
    const totalNeeded = detail.requirements.reduce((a, b) => a + b.countNeeded, 0);
    const totalAssigned = detail.assignments.length;

    return (
        <div className="space-y-8">
            {/* HLAVIČKA */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className={`text-3xl font-bold ${active ? "text-green-600" : "text-[#600000]"}`}>
                        {detail.title}
                        {active && (
                            <span className="ml-3 inline-block">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        #{detail.id} • Vytvorené {formatDate(detail.createdAt)}
                    </p>
                </div>
                {active && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-full text-sm font-bold">
                        → AKTÍVNE
                    </span>
                )}
            </div>

            {/* DÁTUMY */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" /></svg>
                    Trvanie obdobia
                </h3>
                <p className="text-2xl font-medium">
                    {formatDate(detail.startDate)} – {formatDate(detail.endDate)}
                </p>
            </div>

            {/* POPIS */}
            {detail.description && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Popis</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        {detail.description}
                    </p>
                </div>
            )}

            {/* POŽIADAVKY */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Požadovaní pracovníci
                    </span>
                    <span className="text-sm text-gray-600">{totalNeeded} osôb</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {detail.requirements.map(r => (
                        <div key={r.profession} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg text-center">
                            <p className="font-medium text-[#600000] dark:text-[#600000]">
                                {r.profession === "WELDER" ? "Zvárací" : r.profession === "BRICKLAYER" ? "Murári" : "Ostatní"}
                            </p>
                            <p className="text-3xl font-bold mt-2">{r.countNeeded}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRIRADENÍ */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 9c1.333 0 2.416.67 3 1.5.584.83 1 1.83 1 3 0 .34-.024.67-.07 1H12.93zM9 11a5 5 0 00-5 5h10a5 5 0 00-5-5z" /></svg>
                        Priradení pracovníci
                    </span>
                    <span className={`text-sm font-medium ${totalAssigned >= totalNeeded ? "text-green-600" : "text-orange-600"}`}>
                        {totalAssigned} / {totalNeeded}
                    </span>
                </h3>
                {detail.assignments.length === 0 ? (
                    <p className="text-gray-500 italic">Zatiaľ nikto nie je priradený</p>
                ) : (
                    <div className="space-y-3">
                        {detail.assignments.map(a => (
                            <div key={a.user.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div>
                                    <p className="font-medium">{a.user.name || a.user.username}</p>
                                    <p className="text-sm text-gray-600">
                                        @{a.user.username} • {formatDate(a.fromDate)} – {formatDate(a.toDate)}
                                    </p>
                                </div>
                                <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700">
                                    Odstrániť
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AKCIE */}
            <div className="flex gap-4 pt-6">
                <button className="flex-1 bg-[#600000] text-white py-3 rounded-lg font-bold hover:bg-[#4b0000]">
                    Upraviť obdobie
                </button>
                <button className="flex-1 border-2 border-[#600000] text-[#600000] py-3 rounded-lg font-bold hover:bg-[#600000]/5">
                    Pridať pracovníka
                </button>
            </div>
        </div>
    );
}