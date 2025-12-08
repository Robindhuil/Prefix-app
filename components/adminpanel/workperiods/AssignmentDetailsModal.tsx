"use client";

import { X, Calendar, Clock, Briefcase } from "lucide-react";
import SharedDocuments from "@/components/dashboard/assignment/SharedDocuments";
import { createPortal } from "react-dom";
import { useEffect } from "react";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";

type PrismaDocument = {
    id: number;
    fileName: string;
    mimeType?: string | null;
    size: number;
    documentType: DocumentType;
    createdAt?: string | Date;
    hash?: string | null;
};

type AssignmentDocument = {
    id: number;
    document: PrismaDocument;
};

type Assignment = {
    id: number;
    workPeriod: {
        title: string;
        startDate: string;
        endDate: string;
        description?: string;
    };
    profession: "WELDER" | "BRICKLAYER" | "OTHER";
    fromDate: string;
    toDate: string;
    documents?: AssignmentDocument[];
    user: {
        id: number;
        username: string;
        name: string | null;
    };
};

interface AssignmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: Assignment | null;
    isUserAdmin?: boolean; // <- add this prop
}

const formatDate = (date: string) => new Date(date).toLocaleDateString("sk-SK");

type Status = "active" | "upcoming" | "ended";
const getStatus = (from: string, to: string): Status => {
    const now = new Date();
    const start = new Date(from);
    const end = new Date(to);
    if (now >= start && now <= end) return "active";
    if (now < start) return "upcoming";
    return "ended";
};

const statusColors = {
    active: {
        titleColor: "text-green-700 dark:text-green-400",
        badgeBg: "bg-green-100 dark:bg-green-900",
        badgeText: "text-green-800 dark:text-green-200",
        label: "AKTÍVNE TERAZ",
        labelColor: "text-green-700 dark:text-green-400",
        borderColor: "border-green-500",
        dotBg: "bg-green-500",
        dotPing: "bg-green-400",
    },
    upcoming: {
        titleColor: "text-yellow-700 dark:text-yellow-400",
        badgeBg: "bg-yellow-100 dark:bg-yellow-900",
        badgeText: "text-yellow-800 dark:text-yellow-200",
        label: "ČAKÁ NA ŠTART",
        labelColor: "text-yellow-700 dark:text-yellow-400",
        borderColor: "border-yellow-500",
        dotBg: "bg-yellow-500",
        dotPing: "bg-yellow-400",
    },
    ended: {
        titleColor: "text-blue-700 dark:text-blue-400",
        badgeBg: "bg-blue-100 dark:bg-blue-900",
        badgeText: "text-blue-800 dark:text-blue-200",
        label: "UKONČENÉ",
        labelColor: "text-blue-700 dark:text-blue-400",
        borderColor: "border-blue-500",
        dotBg: "bg-blue-500",
        dotPing: "bg-blue-400",
    },
};

export default function AssignmentDetailsModal({
    isOpen,
    onClose,
    assignment,
    isUserAdmin = false, // <- add this prop
}: AssignmentDetailsModalProps) {
    // Lock scroll robustly and restore on close/unmount (runs regardless of render return)
    useEffect(() => {
        if (!isOpen) return;

        // Save current scroll position
        const scrollY = window.scrollY;
        // Prevent background scroll without layout shift
        document.documentElement.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";

        // Optional: compensate for scrollbar removal to avoid content shift
        const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarGap > 0) {
            document.documentElement.style.paddingRight = `${scrollbarGap}px`;
        }

        return () => {
            // Restore styles and scroll position
            document.documentElement.style.overflow = "";
            document.documentElement.style.paddingRight = "";
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            // Restore scroll to the previous position
            if (top) {
                const y = parseInt(top || "0", 10) * -1;
                window.scrollTo(0, y);
            }
        };
    }, [isOpen]);

    // After the effect is defined, handle render
    if (!isOpen || !assignment) return null;

    const { workPeriod, profession, fromDate, toDate, user } = assignment;
    const status = getStatus(fromDate, toDate);
    const colors = statusColors[status];

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Provide a delete handler for documents rendered inside this modal
    const handleDeleteDocument = async (documentId: number) => {
        try {
            await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
            // Optionally trigger a refresh outside of this component
            // e.g., re-fetch assignment details
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Failed to delete document in modal:", e);
        }
    };

    // Render modal detached from any transformed ancestors
    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-9998"
                onClick={handleBackdropClick}
            />

            {/* Modal */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-9999 p-4"
                onClick={handleBackdropClick}
            >
                <div
                    className="background rounded-3xl shadow-3xl w-screen max-w-[95vw] max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 background z-10 p-6 border-b border-custom flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-color">
                                {user.name || "noname"} (@{user.username})
                            </h2>
                            <p className="input-text mt-2">Detaily priradenia</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="cl-text-decor hover:opacity-70 transition cursor-pointer"
                        >
                            <X className="w-7 h-7" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Assignment Info Card */}
                        <div className={`bg-card rounded-3xl p-8 border-4 ${colors.borderColor}`}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className={`text-2xl font-bold ${colors.titleColor}`}>
                                    {workPeriod.title}
                                </h3>
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${colors.badgeBg} ${colors.badgeText}`}>
                                    <span className="relative flex items-center justify-center">
                                        {status === "active" && (
                                            <span className={`absolute inline-flex h-3 w-3 rounded-full ${colors.dotPing} opacity-75 animate-ping`}></span>
                                        )}
                                        {status === "upcoming" && (
                                            <span className={`absolute inline-flex h-3 w-3 rounded-full ${colors.dotPing} opacity-75 animate-pulse`}></span>
                                        )}
                                        <span className={`relative inline-flex h-3 w-3 rounded-full ${colors.dotBg}`}></span>
                                    </span>
                                    <span>{colors.label}</span>
                                </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-background p-3 rounded-xl">
                                        <Briefcase className="w-8 h-8 cl-text-decor" />
                                    </div>
                                    <div>
                                        <p className="text-sm input-text">Profesia</p>
                                        <p className="font-bold text-color">
                                            {profession === "WELDER"
                                                ? "Zvárač"
                                                : profession === "BRICKLAYER"
                                                    ? "Murár"
                                                    : "Ostatné"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-background p-3 rounded-xl">
                                        <Calendar className="w-8 h-8 cl-text-decor" />
                                    </div>
                                    <div>
                                        <p className="text-sm input-text">Projekt trvá</p>
                                        <p className="font-bold text-color text-sm">
                                            {formatDate(workPeriod.startDate)} – {formatDate(workPeriod.endDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-background p-3 rounded-xl">
                                        <Clock className="w-8 h-8 cl-text-decor" />
                                    </div>
                                    <div>
                                        <p className="text-sm input-text">Priradenie</p>
                                        <p className="font-bold text-color text-sm">
                                            {formatDate(fromDate)} – {formatDate(toDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {workPeriod.description && (
                                <div className="mt-6 p-4 bg-background rounded-xl">
                                    <p className="input-text">
                                        <strong>Popis:</strong> {workPeriod.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Documents Section */}
                        <SharedDocuments
                            documents={assignment.documents ?? []}
                            assignment={assignment}
                            gridLayout={true}
                            // Force admin tools visible in this modal
                            isUserAdmin={true}
                        />
                    </div>
                </div>
            </div>
        </>,
        typeof document !== "undefined" ? document.body : ({} as HTMLElement)
    );
}
