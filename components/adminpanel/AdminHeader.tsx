// components/adminpanel/AdminHeader.tsx
"use client";

import { Users, Shield, Calendar } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

type Tab = "users" | "admin" | "workperiods";
type AdminHeaderProps = {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
};

export default function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-card  backdrop-blur-xl rounded-2xl shadow-xl border border-custom p-6 mb-8">
            <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => onTabChange("users")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all text-white duration-300 ${activeTab === "users"
                        ? "bg-linear-to-r cl-decor shadow-lg scale-105 cl-bg-decor"
                        : "bg-neutral"
                        }`}
                >
                    <Users className="w-5 h-5" />
                    {t("adminPanel.usersTab") || "Používatelia"}
                </button>

                <button
                    onClick={() => onTabChange("admin")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all text-white duration-300 ${activeTab === "admin"
                        ? "bg-linear-to-r cl-decor shadow-lg scale-105 cl-bg-decor"
                        : "bg-neutral"
                        }`}
                >
                    <Shield className="w-5 h-5" />
                    {t("adminPanel.adminTab") || "Admin"}
                </button>

                <button
                    onClick={() => onTabChange("workperiods")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all text-white duration-300 ${activeTab === "workperiods"
                        ? "bg-linear-to-r cl-decorshadow-lg scale-105 cl-bg-decor"
                        : "bg-neutral"
                        }`}
                >
                    <Calendar className="w-5 h-5" />
                    {t("adminPanel.workPeriodsTab") || "Pracovné obdobia"}
                </button>
            </div>
        </div>
    );
}