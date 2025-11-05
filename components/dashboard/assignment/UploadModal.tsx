// components/dashboard/UploadModal.tsx
"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { megaUploadAction } from "@/app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/megaUploadAction";
import { useToast } from "@/components/ui/ToastProvider";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";

interface UploadModalProps {
    open: boolean;
    onClose: () => void;
    assignmentId: number;
    selectedType: DocumentType;
}

export default function UploadModal({ open, onClose, assignmentId, selectedType }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const { addToast } = useToast();

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setStatus("idle");
            setMessage("");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        onDragEnter: () => setDragActive(true),
        onDragLeave: () => setDragActive(false),
    });

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage("Nahrávam... 0%");

        let progress = 0;
        const interval = setInterval(() => {
            progress += 15;
            if (progress <= 90) setMessage(`Nahrávam... ${progress}%`);
        }, 400);

        try {
            const result = await megaUploadAction(file, assignmentId, selectedType);
            clearInterval(interval);
            setMessage("Finalizujem... 100%");

            if (result.success) {
                setStatus("success");
                setMessage("Dokument nahraný!");
                addToast("Dokument bol pridaný do " + selectedType, "success");
                setTimeout(() => {
                    setFile(null);
                    setUploading(false);
                    onClose();
                    window.location.reload(); // alebo revalidate
                }, 1200);
            } else {
                throw new Error(result.error);
            }
        } catch (err: any) {
            clearInterval(interval);
            setStatus("error");
            setMessage(err.message || "Chyba servera");
            addToast("Nahrávanie zlyhalo", "error");
        } finally {
            setUploading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" onClick={onClose} />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-10">
                        <button onClick={onClose} className="absolute top-6 right-6">
                            <X className="w-7 h-7 text-gray-500 hover:text-red-600" />
                        </button>

                        <h2 className="text-3xl font-bold text-[#600000] mb-8">
                            Nahrať do: <span className="text-2xl">{getLabel(selectedType)}</span>
                        </h2>

                        {!file ? (
                            <div
                                {...getRootProps()}
                                className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${dragActive ? "border-[#600000] bg-[#600000]/10" : "border-gray-300"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="w-20 h-20 mx-auto mb-6 text-[#600000]" />
                                <p className="text-2xl font-bold">Pretiahnite alebo kliknite</p>
                                <p className="text-gray-500 mt-3">Max 50 MB • PDF, DOC, XLS</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between bg-gradient-to-r from-[#600000]/10 p-6 rounded-2xl">
                                    <div className="flex items-center gap-5">
                                        <FileText className="w-14 h-14 text-[#600000]" />
                                        <div>
                                            <p className="text-xl font-bold">{file.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {(file.size / 1024 / 1024).toFixed(1)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setFile(null)}>
                                        <X className="w-7 h-7 text-red-600" />
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#600000] animate-pulse">
                                        {message}
                                    </p>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all ${uploading
                                            ? "bg-gray-500"
                                            : "bg-[#600000] hover:bg-[#800000] hover:scale-105 shadow-2xl"
                                        }`}
                                >
                                    {uploading ? "Čakaj..." : "Nahrať do " + getLabel(selectedType)}
                                </button>

                                {status === "success" && (
                                    <div className="bg-green-100 text-green-800 p-6 rounded-2xl flex items-center gap-4">
                                        <CheckCircle className="w-10 h-10" />
                                        <p className="text-xl font-bold">Hotovo!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function getLabel(type: DocumentType) {
    return {
        INVOICE: "Faktúry",
        ORDER: "Objednávky",
        CONTRACT: "Zmluvy",
        OTHER: "Ostatné",
    }[type];
}