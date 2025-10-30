"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { Save, Building2, Loader2, CheckCircle, XCircle, X } from "lucide-react";
import { format } from "date-fns";
import { getCompanyInfoAction } from "@/app/(root)/adminpanel/adminInfo/actions/getCompanyInfoAction";
import { updateCompanyInfoAction } from "@/app/(root)/adminpanel/adminInfo/actions/updateCompanyInfoAction";


type FormData = {
    companyId: string;
    companyName: string;
    companyIdNumber: string;
    legalForm: string;
    foundingDate: string;
    registeredOffice: string;
    shareCapital: string;
    representation: string;
    representativeName: string;
    representativeAddress: string;
    functionStartDate: string;
    contactEmail: string;
};

export default function AdminInfo() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const result = await getCompanyInfoAction();

            if (result.success && result.data) {
                setFormData(result.data);
            } else {
                setError(t("adminPanel.adminInfo.loadError"));
            }
            setIsLoading(false);
        };

        loadData();
    }, [t]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);


    const handleChange = (key: keyof FormData, value: string) => {
        if (!formData) return;
        setFormData((prev) => ({ ...prev!, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData) return;

        setIsSaving(true);
        setError("");

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        const result = await updateCompanyInfoAction(formDataToSend);

        if (result.success) {
            setToast({ message: t("adminPanel.adminInfo.savedAlert"), type: "success" });
        } else {
            setToast({ message: t("adminPanel.adminInfo.saveError"), type: "error" });
        }

        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="w-full p-6 flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#600000]" />
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="w-full p-6 text-center text-red-600 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#600000] dark:text-[#600000] flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r cl-decor rounded-full flex items-center justify-center shadow-lg">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    {t("adminPanel.adminInfo.title")}
                </h1>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Basic Information */}
            <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                    {t("adminPanel.adminInfo.basicInfo")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                        label={t("adminPanel.adminInfo.companyName")}
                        value={formData.companyName}
                        onChange={(val) => handleChange("companyName", val)}
                    />
                    <InputField
                        label={t("adminPanel.adminInfo.companyIdNumber")}
                        value={formData.companyIdNumber}
                        onChange={(val) => handleChange("companyIdNumber", val)}
                    />
                    <InputField
                        label={t("adminPanel.adminInfo.legalForm")}
                        value={formData.legalForm}
                        onChange={(val) => handleChange("legalForm", val)}
                    />
                    <DatePickerField
                        label={t("adminPanel.adminInfo.foundingDate")}
                        value={formData.foundingDate}
                        onChange={(val) => handleChange("foundingDate", val)}
                    />
                    <InputField
                        label={t("adminPanel.adminInfo.registeredOffice")}
                        value={formData.registeredOffice}
                        onChange={(val) => handleChange("registeredOffice", val)}
                    />
                </div>
            </section>

            {/* Statutory Representative */}
            <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                    {t("adminPanel.adminInfo.representative")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                        label={t("adminPanel.adminInfo.representativeName")}
                        value={formData.representativeName}
                        onChange={(val) => handleChange("representativeName", val)}
                    />
                    <InputField
                        label={t("adminPanel.adminInfo.representativeAddress")}
                        value={formData.representativeAddress}
                        onChange={(val) => handleChange("representativeAddress", val)}
                    />
                    <DatePickerField
                        label={t("adminPanel.adminInfo.functionStartDate")}
                        value={formData.functionStartDate}
                        onChange={(val) => handleChange("functionStartDate", val)}
                    />
                </div>
            </section>

            {/* Contact */}
            <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                    {t("adminPanel.adminInfo.contact")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField
                        label={t("adminPanel.adminInfo.contactEmail")}
                        value={formData.contactEmail}
                        onChange={(val) => handleChange("contactEmail", val)}
                    />
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-linear-to-r cl-decor text-white rounded-lg font-medium hover:from-[#4b0000] hover:to-[#600000] transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Save className="w-6 h-6" />
                    )}
                    {isSaving ? t("adminPanel.adminInfo.saving") : t("adminPanel.adminInfo.saveChanges")}
                </button>
            </div>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <div
                        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${toast.type === "success"
                            ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                            : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                            }`}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle className="w-6 h-6" />
                        ) : (
                            <XCircle className="w-6 h-6" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Input Field
function InputField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#600000] focus:border-[#600000] transition-all text-base"
                placeholder={label}
            />
        </div>
    );
}

// Date Picker Field
function DatePickerField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#600000] focus:border-[#600000] transition-all text-base"
            />
        </div>
    );
}