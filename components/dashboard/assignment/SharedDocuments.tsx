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
        icon: <FileSpreadsheet className="w-6 h-6 cl-text-decor" />,
        color: "from-blue-500/20 to-blue-400/10 border-blue-500 hover:border-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        type: "ORDER" as DocumentType,
        label: "Objednávky",
        icon: <FileArchive className="w-6 h-6 cl-text-decor" />,
        color: "from-amber-500/20 to-amber-400/10 border-amber-500 hover:border-amber-600",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        type: "CONTRACT" as DocumentType,
        label: "Zmluvy",
        icon: <FileSignature className="w-6 h-6 cl-text-decor" />,
        color: "from-emerald-500/20 to-emerald-400/10 border-emerald-500 hover:border-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        type: "OTHER" as DocumentType,
        label: "Ostatné",
        icon: <FileText className="w-6 h-6 cl-text-decor" />,
        color: "from-gray-500/20 to-gray-400/10 border-gray-500 hover:border-gray-600",
        bg: "bg-gray-50 dark:bg-gray-700/20",
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
            <div className="bg-card rounded-3xl shadow-2xl mt-5 p-8 lg:p-12">
                {/* HLAVIČKA */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-card p-3 rounded-2xl">
                            <FileText className="w-10 h-10 cl-text-decor" />
                        </div>
                        <h2 className="text-3xl font-black text-color">
                            Zdieľané dokumenty
                        </h2>
                    </div>
                    <div className="cl-bg-decor text-white px-6 py-3 rounded-full text-xl font-bold shadow-xl">
                        {documents.length}
                    </div>
                </div>

                {/* SEKCIE POD SEBOU */}
                <div className="space-y-8">
                    {sectionConfig.map((sec) => {
                        const docs = grouped[sec.type] || [];
                        return (
                            <div
                                key={sec.type}
                                className={`rounded-3xl border-4 ${sec.color} bg-linear-to-br p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.005] ${sec.bg}`}
                            >
                                {/* HORNÁ LIŠTA */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-card p-4 rounded-2xl shadow-lg">
                                            {sec.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-color">
                                            {sec.label}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="cl-text-decor] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                            {docs.length}
                                        </div>

                                        <button
                                            onClick={() => openModal(sec.type)}
                                            className=" cursor-pointer cl-bg-decor text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                                            title={`Nahrať do ${sec.label}`}
                                        >
                                            <PlusCircle className="w-7 h-7" />
                                        </button>
                                    </div>
                                </div>

                                {/* DOKUMENTY */}
                                <div className="space-y-4 min-h-40">
                                    {docs.length > 0 ? (
                                        docs.map((ad: any) => {
                                            const doc = ad.document;
                                            return (
                                                <a
                                                    key={ad.id}
                                                    href={`/api/documents/${doc.id}`}
                                                    download={doc.fileName}
                                                    className="group flex items-center justify-between p-6 bg-card rounded-2xl border-2 border-custom hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="bg-card p-4 rounded-xl group-hover:scale-110 transition">
                                                            <FileText className="w-10 h-10 cl-text-decor" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg text-color group-hover:underline">
                                                                {doc.fileName}
                                                            </p>
                                                            <p className="text-sm input-text">
                                                                {(doc.size / 1024 / 1024).toFixed(1)} MB
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* DOWNLOAD TLAČIDLO */}
                                                    <div className="bg-card p-3 rounded-xl transition-all duration-300 group-hover:scale-110">
                                                        <Download className="w-7 h-7 cl-text-decor group-hover:translate-y-1 transition" />
                                                    </div>
                                                </a>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-center input-text">
                                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="text-lg font-medium italic">
                                                Žiadne {sec.label.toLowerCase()} zatiaľ
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