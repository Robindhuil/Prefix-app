// components/adminpanel/workperiods/WorkPeriodsDashboardDetail.tsx
"use client";

import { useTranslation } from "@/app/i18n/I18nProvider";
import { useEffect, useState } from "react";
import { getWorkPeriodDetail } from "@/app/(root)/adminpanel/workperiods/actions/getWorkPeriodDetailAction";
import { deleteWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/deleteWorkPeriodAction";
import AssignedUsersTable from "./AssignedUsersTable";
import WorkPeriodModal from "./WorkPeriodModal"; // ← NOVÉ
import { Profession } from "@/app/generated/prisma/client";
import { Trash2, Edit, AlertCircle } from "lucide-react";

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
        profession: Profession;
        fromDate: string;
        toDate: string;
    }[];
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export default function WorkPeriodsDashboardDetail({
    periodId,
    onEdit
}: {
    periodId: number | null;
    onEdit?: (data: {
        id: number;
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
    }) => void;
}) {
    const { t } = useTranslation();
    const [detail, setDetail] = useState<Detail | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // EDIT MODAL STAV
    const [editModalOpen, setEditModalOpen] = useState(false);

    const loadDetail = async () => {
        if (!periodId) {
            setDetail(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await getWorkPeriodDetail(periodId);
        setDetail(data);
        setLoading(false);
    };

    useEffect(() => {
        loadDetail();
    }, [periodId]);

    useEffect(() => {
        const handler = () => {
            if (periodId) loadDetail();
        };
        window.addEventListener("workperiod:updated", handler);
        window.addEventListener("workperiod:deleted", handler);
        window.addEventListener("assignment:changed", handler);

        return () => {
            window.removeEventListener("workperiod:updated", handler);
            window.removeEventListener("workperiod:deleted", handler);
            window.removeEventListener("assignment:changed", handler);
        };
    }, [periodId]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });

    const handleDelete = async () => {
        if (!detail) return;
        setIsDeleting(true);
        const result = await deleteWorkPeriodAction(detail.id);
        setIsDeleting(false);
        if (result.success) {
            setDeleteModal(false);
            window.dispatchEvent(new CustomEvent("workperiod:deleted"));
        } else {
            alert(result.error || "Chyba pri mazaní");
        }
    };

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
        <>
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

                    <div className="flex items-center gap-3">
                        {active && (
                            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-full text-sm font-bold">
                                → AKTÍVNE
                            </span>
                        )}

                        {/* AKCIE */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
                                title="Upraviť obdobie"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setDeleteModal(true)}
                                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-md"
                                title="Odstrániť obdobie"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* DÁTUMY */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
                        </svg>
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
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Požadovaní pracovníci
                        </span>
                        <span className="text-sm text-gray-600">{totalNeeded} osôb</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {detail.requirements.map(r => (
                            <div key={r.profession} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg text-center">
                                <p className="font-medium text-[#600000]">
                                    {r.profession === "WELDER" ? "Zvárací" : r.profession === "BRICKLAYER" ? "Murári" : "Ostatní"}
                                </p>
                                <p className="text-3xl font-bold mt-2">{r.countNeeded}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRIRADENIA */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 9c1.333 0 2.416.67 3 1.5.584.83 1 1.83 1 3 0 .34-.024.67-.07 1H12.93zM9 11a5 5 0 00-5 5h10a5 5 0 00-5-5z" />
                            </svg>
                            Priradení pracovníci
                        </span>
                        <span className={`text-sm font-medium ${totalAssigned >= totalNeeded ? "text-green-600" : "text-orange-600"}`}>
                            {totalAssigned} / {totalNeeded}
                        </span>
                    </h3>
                    <AssignedUsersTable
                        periodId={detail.id}
                        startDate={detail.startDate}
                        endDate={detail.endDate}
                        assignments={detail.assignments}
                    />
                </div>
            </div>

            {/* DELETE MODAL */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertCircle className="w-8 h-8" />
                            <h3 className="text-xl font-bold">Odstrániť obdobie?</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Naozaj chceš odstrániť obdobie <strong>{detail.title}</strong>?<br />
                            <span className="text-sm">Toto je nevratná operácia.</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                            >
                                Zrušiť
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
                            >
                                {isDeleting ? "Odstraňuje sa..." : "Odstrániť"}
                                {!isDeleting && <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL – UNIVERZÁLNY */}
            <WorkPeriodModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                mode="edit"
                initialData={{
                    id: detail.id,
                    title: detail.title,
                    description: detail.description,
                    startDate: detail.startDate,
                    endDate: detail.endDate,
                }}
            />
        </>
    );
}