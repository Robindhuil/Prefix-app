"use client";

import { useState } from "react";
import {
    FileText,
    Download,
    FileSignature,
    FileSpreadsheet,
    FileArchive,
    PlusCircle,
} from "lucide-react";
import UploadModal from "./UploadModal";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";

const sectionConfig = [
    {
        type: "INVOICE" as DocumentType,
        label: "Faktúry",
        icon: <FileSpreadsheet className="w-6 h-6" />,
        color: "from-blue-500/20 to-blue-400/10 border-blue-500 hover:border-blue-600",
    },
    {
        type: "ORDER" as DocumentType,
        label: "Objednávky",
        icon: <FileArchive className="w-6 h-6" />,
        color: "from-amber-500/20 to-amber-400/10 border-amber-500 hover:border-amber-600",
    },
    {
        type: "CONTRACT" as DocumentType,
        label: "Zmluvy",
        icon: <FileSignature className="w-6 h-6" />,
        color: "from-emerald-500/20 to-emerald-400/10 border-emerald-500 hover:border-emerald-600",
    },
    {
        type: "OTHER" as DocumentType,
        label: "Ostatné",
        icon: <FileText className="w-6 h-6" />,
        color: "from-gray-500/20 to-gray-400/10 border-gray-500 hover:border-gray-600",
    },
];

export default function SharedDocuments({
    documents = [],
    assignment,
}: {
    documents: any[];
    assignment: any;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<DocumentType>("OTHER");

    const grouped = documents.reduce((acc: any, ad: any) => {
        const type = ad.document.documentType || "OTHER";
        if (!acc[type]) acc[type] = [];
        acc[type].push(ad);
        return acc;
    }, {});

    const openModal = (type: DocumentType) => {
        setSelectedType(type);
        setIsOpen(true);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-10">
                {/* HLAVIČKA */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#600000]" />
                        <h2 className="text-2xl font-bold text-[#600000]">
                            Zdieľané dokumenty
                        </h2>
                    </div>
                    <div className="bg-[#600000] text-white px-4 py-2 rounded-full text-lg font-semibold shadow-md">
                        {documents.length}
                    </div>
                </div>

                {/* SEKCIE POD SEBOU */}
                <div className="flex flex-col gap-6">
                    {sectionConfig.map((sec) => {
                        const docs = grouped[sec.type] || [];
                        return (
                            <div
                                key={sec.type}
                                className={`relative rounded-2xl border-2 ${sec.color} bg-gradient-to-br p-6 transition-all duration-300 shadow-md hover:shadow-lg`}
                            >
                                {/* HORNÁ LIŠTA */}
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/80 dark:bg-gray-900/80 p-3 rounded-xl shadow">
                                            {sec.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#600000]">
                                            {sec.label}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#600000] text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow">
                                            {docs.length}
                                        </div>

                                        <button
                                            onClick={() => openModal(sec.type)}
                                            className="bg-[#600000] hover:bg-[#900000] text-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                            title={`Nahrať do ${sec.label}`}
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* DOKUMENTY */}
                                <div className="space-y-3 min-h-32">
                                    {docs.length > 0 ? (
                                        docs.map((ad: any) => {
                                            const doc = ad.document;
                                            return (
                                                <a
                                                    key={ad.id}
                                                    href={doc.gcsPath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center justify-between p-4 bg-white/90 dark:bg-gray-900/90 rounded-xl border border-[#600000]/10 hover:border-[#600000]/60 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-[#600000]/10 p-3 rounded-xl group-hover:scale-110 transition">
                                                            <FileText className="w-6 h-6 text-[#600000]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-base text-[#600000] group-hover:underline">
                                                                {doc.fileName}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {(doc.size / 1024 / 1024).toFixed(1)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Download className="w-5 h-5 text-[#600000] group-hover:translate-y-0.5 transition" />
                                                </a>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 text-center text-gray-400">
                                            <FileText className="w-10 h-10 mb-2 opacity-20" />
                                            <p className="text-base italic">
                                                Žiadne {sec.label.toLowerCase()} zatiaľ
                                            </p>
                                            <p className="text-xs mt-1">
                                                Klikni na [+] a pridaj prvý!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL */}
            <UploadModal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                assignmentId={assignment.id}
                selectedType={selectedType}
            />
        </>
    );
}
