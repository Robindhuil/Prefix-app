"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { megaUploadAction } from "./actions/megaUploadAction";


export default function UploadPage() {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
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
        setStatus("idle");
        setMessage(t("upload.uploading") || "Nahrávam...");

        // Simulácia progressu (klient-side)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setMessage(`${t("upload.uploading") || "Nahrávam"}... ${progress}%`);
            if (progress >= 90) clearInterval(interval);
        }, 300);

        try {
            // Posielame iba file (bez callbacku!)
            const result = await megaUploadAction(file);

            clearInterval(interval);
            setMessage(`${t("upload.uploading") || "Nahrávam"}... 100%`);

            if (result.success) {
                setStatus("success");
                setMessage(t("upload.success") || "Dokument bol úspešne nahraný!");
                setFile(null);
            } else {
                setStatus("error");
                setMessage(result.error || t("upload.error") || "Chyba pri nahrávaní");
            }
        } catch (err: any) {
            clearInterval(interval);
            setStatus("error");
            setMessage(err.message || "Neočakávaná chyba");
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setStatus("idle");
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#600000] dark:text-[#600000] mb-2">
                        {t("upload.title") || "Nahrať dokument"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t("upload.subtitle") || "Podporované formáty: PDF, DOCX, JPG, PNG"}
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragActive
                                ? "border-[#600000] bg-[#600000]/5 dark:bg-[#600000]/10"
                                : "border-gray-300 dark:border-gray-700 hover:border-[#600000]/50"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-16 h-16 mx-auto mb-4 text-[#600000] opacity-70" />
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                {dragActive
                                    ? t("upload.dropHere") || "Pustite súbor sem"
                                    : t("upload.dragOrClick") || "Pretiahnite súbor sem alebo kliknite pre výber"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {t("upload.maxSize") || "Maximálna veľkosť: 10 MB"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-10 h-10 text-[#600000]" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={reset}
                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress message */}
                            {uploading && (
                                <div className="text-center py-4">
                                    <p className="text-lg font-medium text-[#600000] animate-pulse">
                                        {message}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${uploading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#600000] hover:bg-[#4b0000] shadow-lg hover:shadow-xl"
                                    }`}
                            >
                                <Upload className="w-5 h-5" />
                                {uploading ? t("upload.inProgress") || "Nahrávam..." : t("upload.start") || "Nahrať dokument"}
                            </button>

                            {status !== "idle" && !uploading && (
                                <div
                                    className={`flex items-center gap-3 p-4 rounded-lg ${status === "success"
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                        }`}
                                >
                                    {status === "success" ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6" />
                                    )}
                                    <p className="font-medium">{message}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>{t("upload.encrypted") || "Všetky dokumenty sú šifrované pred nahraním"}</p>
                </div>
            </div>
        </div>
    );
}