"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { Save, Building2 } from "lucide-react";

export default function AdminInfo() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        companyName: "PREFIX s.r.o.",
        companyId: "51 893 258",
        legalForm: "Spoločnosť s ručením obmedzeným",
        foundingDate: "06.09.2018",
        registeredOffice: "Turáková 945/2, 013 01 Teplička nad Váhom",
        shareCapital: "5 000 EUR",
        representation: "Konateľ koná samostatne.",
        representativeName: "Róbert Gaššo",
        representativeAddress: "Turáková 945/2, Teplička nad Váhom",
        functionStartDate: "06.09.2018",
        contactEmail: "dHt9K@example.com",
    });

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        console.log("Saved company data:", formData);
        alert(t("adminPanel.adminInfo.savedAlert"));
    };

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
                        label={t("adminPanel.adminInfo.companyId")}
                        value={formData.companyId}
                        onChange={(val) => handleChange("companyId", val)}
                    />
                    <InputField
                        label={t("adminPanel.adminInfo.legalForm")}
                        value={formData.legalForm}
                        onChange={(val) => handleChange("legalForm", val)}
                    />
                    <InputField
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
                    <InputField
                        label={t("adminPanel.adminInfo.functionStartDate")}
                        value={formData.functionStartDate}
                        onChange={(val) => handleChange("functionStartDate", val)}
                    />
                </div>
            </section>

            {/* Statutory Representative */}
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
                    className="flex items-center gap-2 px-8 py-3 bg-linear-to-r cl-decor text-white rounded-lg font-medium hover:from-[#4b0000] hover:to-[#600000] transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
                >
                    <Save className="w-6 h-6" />
                    {t("adminPanel.adminInfo.saveChanges")}
                </button>
            </div>
        </div>
    );
}

// Input Field Component
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