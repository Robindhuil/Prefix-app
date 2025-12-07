"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { Save, Building2, Loader2 } from "lucide-react";
import { getCompanyInfoAction } from "@/app/(root)/adminpanel/adminInfo/actions/getCompanyInfoAction";
import { updateCompanyInfoAction } from "@/app/(root)/adminpanel/adminInfo/actions/updateCompanyInfoAction";
import { useToast } from "@/components/ui/ToastProvider";

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
    const { addToast } = useToast();

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
            addToast(t("toast.savedAlert"), "success");
        } else {
            addToast(t("toast.saveError"), "error");
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
                <h1 className="text-3xl font-bold text-color flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r  cl-bg-decor rounded-full flex items-center justify-center shadow-lg">
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
            <section className="bg-card backdrop-blur-sm rounded-2xl shadow-xl border border-custom p-8">
                <h2 className="text-xl font-semibold cl-text-decor mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
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
            <section className="bg-card backdrop-blur-sm rounded-2xl shadow-xl border border-custom p-8">
                <h2 className="text-xl font-semibold cl-text-decor mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
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
            <section className="bg-card backdrop-blur-sm rounded-2xl shadow-xl border border-custom p-8">
                <h2 className="text-xl font-semibold cl-text-decor mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
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
                    className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-linear-to-r text-white rounded-lg font-medium cl-bg-decor transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Save className="w-6 h-6" />
                    )}
                    {isSaving ? t("adminPanel.adminInfo.saving") : t("adminPanel.adminInfo.saveChanges")}
                </button>
            </div>
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
            <label className="text-sm font-medium text-color mb-2">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-custom input-bg backdrop-blur-sm input-text focus-ring focus-border transition-all text-base"
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
            <label className="text-sm font-medium text-color">
                {label}
            </label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-custom input-bg backdrop-blur-sm input-text focus-ring focus-border transition-all text-base"
            />
        </div>
    );
}