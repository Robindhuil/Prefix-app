"use client";

import {
    FileText,
    FileSignature,
    FileSpreadsheet,
    FileArchive,
} from "lucide-react";
import DocumentCard from "./DocumentCard";

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

type DocumentGroupProps = {
    type: DocumentType;
    documents: Document[];
    userId: string;
};

export default function DocumentGroup({ type, documents, userId }: DocumentGroupProps) {
    const config = documentConfig[type] || documentConfig.OTHER;
    const Icon = config.icon;

    return (
        <div className={`${config.bg} border-2 ${config.borderColor} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-6">
                <Icon className={`w-7 h-7 ${config.color}`} />
                <h3 className={`text-2xl font-bold ${config.color}`}>
                    {config.label}
                </h3>
                <span className={`ml-auto px-4 py-1 rounded-full text-sm font-bold ${config.bg} ${config.color} border ${config.borderColor}`}>
                    {documents.length}
                </span>
            </div>
            <div className="space-y-4">
                {documents.map(doc => (
                    <DocumentCard key={doc.id} document={doc} userId={userId} />
                ))}
            </div>
        </div>
    );
}
