"use client";

import {
    FileText,
    Download,
    FileSignature,
    FileSpreadsheet,
    FileArchive,
    Calendar,
    Clock,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";

const documentConfig = {
    INVOICE: {
        label: "Faktúra",
        icon: FileSpreadsheet,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-500/30",
    },
    ORDER: {
        label: "Objednávka",
        icon: FileArchive,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-500/30",
    },
    CONTRACT: {
        label: "Zmluva",
        icon: FileSignature,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        borderColor: "border-emerald-500/30",
    },
    OTHER: {
        label: "Ostatné",
        icon: FileText,
        color: "text-gray-500",
        bg: "bg-gray-50 dark:bg-gray-700/20",
        borderColor: "border-gray-500/30",
    },
};

type AssignmentLink = {
    userAssignmentId: number;
    userAssignment: {
        id: number;
        workPeriod: {
            title: string;
        };
    };
};

type Document = {
    id: number;
    fileName: string;
    size: number;
    documentType: DocumentType;
    description?: string | null;
    createdAt: string;
    assignmentLinks: AssignmentLink[];
};

type DocumentCardProps = {
    document: Document;
    userId: string;
};

export default function DocumentCard({ document, userId }: DocumentCardProps) {
    const config = documentConfig[document.documentType] || documentConfig.OTHER;
    const Icon = config.icon;
    const primaryAssignment = document.assignmentLinks?.[0];

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("sk-SK", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("sk-SK", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const cardContent = (
        <div className="flex items-start justify-between gap-4">
            {/* IKONA A INFO */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-xl ${config.bg} border ${config.borderColor}`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg truncate text-color">
                            {document.fileName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.borderColor}`}>
                            {config.label}
                        </span>
                    </div>
                    {document.description && (
                        <p className="text-sm input-text mb-3">
                            {document.description}
                        </p>
                    )}
                    
                    {/* Assignment info */}
                    {primaryAssignment && (
                        <div className="mb-3 p-3 rounded-lg input-bg border-custom">
                            <div className="flex items-start gap-2">
                                <ExternalLink className="w-4 h-4 cl-text-decor mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs input-text mb-1">
                                        Nahrané pre priradenie:
                                    </p>
                                    <Link
                                        href={`/dashboard/${userId}/assignment/${primaryAssignment.userAssignmentId}`}
                                        className="font-semibold text-sm cl-text-decor hover:underline truncate block"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {primaryAssignment.userAssignment.workPeriod.title}
                                    </Link>
                                    {document.assignmentLinks.length > 1 && (
                                        <p className="text-xs input-text mt-1">
                                            Zdieľané aj v {document.assignmentLinks.length - 1} ďalších priradeniach
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm input-text flex-wrap">
                        <span>{formatFileSize(document.size || 0)}</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(document.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDateTime(document.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            {/* TLAČIDLÁ */}
            <div className="flex items-center gap-2">
                <a
                    href={`/api/documents/${document.id}`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 rounded-xl input-bg border-custom hover:bg-neutral transition-colors"
                    title="Stiahnuť"
                >
                    <Download className="w-5 h-5 input-text" />
                </a>
            </div>
        </div>
    );

    return (
        <div
            className={`${config.bg} border ${config.borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg`}
        >
            {cardContent}
        </div>
    );
}
