"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/adminpanel/AdminHeader";
import UsersSection from "@/components/adminpanel/UsersSection";
import AdminSection from "@/components/adminpanel/AdminSection";

type Tab = "users" | "admin";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<Tab>("users");

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f8f8]/80 via-white/50 to-[#f8f8f8]/80 dark:from-gray-900/80 dark:via-black/50 dark:to-gray-900/80">
            {/* Plná šírka s vnútorným paddingom */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Hlavicka */}
                <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Obsah */}
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/50 p-8 min-h-96">
                    {activeTab === "users" && <UsersSection />}
                    {activeTab === "admin" && <AdminSection />}
                </div>
            </div>
        </div>
    );
}