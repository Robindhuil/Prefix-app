"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/adminpanel/AdminHeader";
import UsersSection from "@/components/adminpanel/users/UsersSection";
import AdminSection from "@/components/adminpanel/AdminSection";

type Tab = "users" | "admin";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<Tab>("users");

    // 🔹 Načítaj uložený tab z localStorage pri načítaní stránky
    useEffect(() => {
        const savedTab = localStorage.getItem("activeAdminTab") as Tab | null;
        if (savedTab === "users" || savedTab === "admin") {
            setActiveTab(savedTab);
        }
    }, []);

    // 🔹 Ulož tab vždy, keď sa zmení
    useEffect(() => {
        localStorage.setItem("activeAdminTab", activeTab);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 min-h-96">
                    {activeTab === "users" && <UsersSection />}
                    {activeTab === "admin" && <AdminSection />}
                </div>
            </div>
        </div>
    );
}
