// app/dashboard/[id]/components/AssignmentsList.tsx
"use client";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

type Status = "active" | "upcoming" | "ended";
const getStatus = (start: string, end: string): Status => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now >= s && now <= e) return "active";
    if (now < s) return "upcoming";
    return "ended";
};

type Assignment = {
    id: number;
    workPeriod: {
        id: number;
        title: string;
        startDate: string;
        endDate: string;
    };
};

export default function AssignmentsList({
    assignments,
    userId,
}: {
    assignments: Assignment[];
    userId: number;
}) {
    const [activeTab, setActiveTab] = useState<"all" | "active" | "upcoming" | "ended">("all");

    // Group assignments by status
    const groupedAssignments = {
        active: assignments.filter(a => getStatus(a.workPeriod.startDate, a.workPeriod.endDate) === "active"),
        upcoming: assignments.filter(a => getStatus(a.workPeriod.startDate, a.workPeriod.endDate) === "upcoming"),
        ended: assignments.filter(a => getStatus(a.workPeriod.startDate, a.workPeriod.endDate) === "ended"),
    };

    const statusColors = {
        active: {
            titleColor: "text-green-700 dark:text-green-400",
            badgeBg: "bg-green-100 dark:bg-green-900",
            badgeText: "text-green-800 dark:text-green-200",
            label: "→ AKTÍVNE",
            labelColor: "text-green-700 dark:text-green-400",
            borderColor: "border-green-500",
            dotBg: "bg-green-500",
            dotPing: "bg-green-400",
            sectionBg: "bg-green-500/10",
            sectionBorder: "border-green-500/30",
        },
        upcoming: {
            titleColor: "text-yellow-700 dark:text-yellow-400",
            badgeBg: "bg-yellow-100 dark:bg-yellow-900",
            badgeText: "text-yellow-800 dark:text-yellow-200",
            label: "→ ČAKÁ",
            labelColor: "text-yellow-700 dark:text-yellow-400",
            borderColor: "border-yellow-500",
            dotBg: "bg-yellow-500",
            dotPing: "bg-yellow-400",
            sectionBg: "bg-yellow-500/10",
            sectionBorder: "border-yellow-500/30",
        },
        ended: {
            titleColor: "text-blue-700 dark:text-blue-400",
            badgeBg: "bg-blue-100 dark:bg-blue-900",
            badgeText: "text-blue-800 dark:text-blue-200",
            label: "→ UKONČENÉ",
            labelColor: "text-blue-700 dark:text-blue-400",
            borderColor: "border-blue-500",
            dotBg: "bg-blue-500",
            dotPing: "bg-blue-400",
            sectionBg: "bg-blue-500/10",
            sectionBorder: "border-blue-500/30",
        },
    };

    const renderAssignmentCard = (a: Assignment, status: Status) => {
        const colors = statusColors[status];
        
        return (
            <Link
                key={a.id}
                href={`/dashboard/${userId}/assignment/${a.id}`}
                className="block group h-full"
            >
                <div className={`h-full p-5 rounded-xl border-2 ${colors.borderColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 input-bg flex flex-col`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3 flex-shrink-0">
                                {status === "active" && (
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}></span>
                                )}
                                {status === "upcoming" && (
                                    <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${colors.dotBg}`}></span>
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                                #{a.workPeriod.id}
                            </span>
                        </div>
                        <ArrowRight className="w-4 h-4 cl-text-decor group-hover:translate-x-1 transition flex-shrink-0" />
                    </div>
                    
                    <h4 className={`font-bold text-lg line-clamp-2 mb-3 transition-colors ${colors.titleColor}`}>
                        {a.workPeriod.title}
                    </h4>

                    <div className="mt-auto">
                        <div className="flex items-center gap-2 text-xs text-color">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                                {formatDate(a.workPeriod.startDate)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-color mt-1">
                            <span className="w-4 h-4 flex-shrink-0"></span>
                            <span className="truncate">
                                {formatDate(a.workPeriod.endDate)}
                            </span>
                        </div>
                        <span className={`inline-block mt-2 ${colors.labelColor} font-bold text-xs`}>
                            {colors.label}
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-color">
                    <Calendar className="w-8 h-8 cl-text-decor" />
                    Tvoje priradenia
                </h2>
                
                {/* Tabs */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-all ${
                            activeTab === "all"
                                ? "cl-bg-decor text-white shadow-md"
                                : "bg-neutral text-white hover:shadow-md"
                        }`}
                    >
                        Všetky ({assignments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                            activeTab === "active"
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-neutral text-white hover:shadow-md"
                        }`}
                    >
                        <span className="relative flex h-2 w-2">
                            {activeTab === "active" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            )}
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Aktívne ({groupedAssignments.active.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                            activeTab === "upcoming"
                                ? "bg-yellow-500 text-white shadow-md"
                                : "bg-neutral text-white hover:shadow-md"
                        }`}
                    >
                        <span className="relative flex h-2 w-2">
                            {activeTab === "upcoming" && (
                                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            )}
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Nadchádzajúce ({groupedAssignments.upcoming.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("ended")}
                        className={`px-4 py-2 cursor-pointer rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                            activeTab === "ended"
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-neutral text-white hover:shadow-md"
                        }`}
                    >
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        Ukončené ({groupedAssignments.ended.length})
                    </button>
                </div>
            </div>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-500 py-16 text-lg">
                    Žiadne priradenia nájdené.
                </p>
            ) : (
                <div className="space-y-8">
                    {/* Active Assignments */}
                    {(activeTab === "all" || activeTab === "active") && groupedAssignments.active.length > 0 && (
                        <div className={`rounded-xl border-2 ${statusColors.active.sectionBorder} ${statusColors.active.sectionBg} p-6`}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                                <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
                                    Aktívne priradenia ({groupedAssignments.active.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedAssignments.active.map(a => renderAssignmentCard(a, "active"))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Assignments */}
                    {(activeTab === "all" || activeTab === "upcoming") && groupedAssignments.upcoming.length > 0 && (
                        <div className={`rounded-xl border-2 ${statusColors.upcoming.sectionBorder} ${statusColors.upcoming.sectionBg} p-6`}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                                </span>
                                <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                                    Nadchádzajúce priradenia ({groupedAssignments.upcoming.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedAssignments.upcoming.map(a => renderAssignmentCard(a, "upcoming"))}
                            </div>
                        </div>
                    )}

                    {/* Ended Assignments */}
                    {(activeTab === "all" || activeTab === "ended") && groupedAssignments.ended.length > 0 && (
                        <div className={`rounded-xl border-2 ${statusColors.ended.sectionBorder} ${statusColors.ended.sectionBg} p-6`}>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="relative flex h-4 w-4">
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                                </span>
                                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                    Ukončené priradenia ({groupedAssignments.ended.length})
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedAssignments.ended.map(a => renderAssignmentCard(a, "ended"))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}