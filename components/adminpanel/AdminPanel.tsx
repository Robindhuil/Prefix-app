// app/(root)/adminpanel/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/adminpanel/AdminHeader";
import UsersSection from "@/components/adminpanel/users/UsersSection";
import AdminSection from "@/components/adminpanel/AdminSection";
import WorkPeriodsSection from "@/components/adminpanel/workperiods/WorkPeriodsSection";

type Tab = "users" | "admin" | "workperiods";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<Tab>("users");

    useEffect(() => {
        const saved = localStorage.getItem("activeAdminTab") as Tab | null;
        if (saved) setActiveTab(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("activeAdminTab", activeTab);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border border-custom p-8 min-h-96">
                    {activeTab === "users" && <UsersSection />}
                    {activeTab === "admin" && <AdminSection />}
                    {activeTab === "workperiods" && <WorkPeriodsSection />}
                </div>
            </div>
        </div>
    );
}