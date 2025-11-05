// components/dashboard/DashboardContent.tsx
"use client";

import { useState, useEffect } from "react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import AssignmentsList from "./AssignmentsList";
import ProfileHeader from "./ProfileHeader";

export default function DashboardContent({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<"profil" | "priradenia">("profil");

    // Načítanie z URL
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash === "priradenia") setActiveTab("priradenia");
    }, []);

    // Prepínanie + URL update
    const switchTab = (tab: "profil" | "priradenia") => {
        setActiveTab(tab);
        window.history.replaceState(null, "", `#${tab}`);
    };

    // Odovzdaj funkciu do Sidebar cez context alebo globálne (najjednoduchšie: window)
    useEffect(() => {
        (window as any).switchDashboardTab = switchTab;
    }, []);

    return (
        <div className="space-y-10 py-8">
            <ProfileHeader user={user} />

            <div className="flex border-b dark:border-gray-700 mb-8">
                <button
                    onClick={() => switchTab("profil")}
                    className={`px-8 py-4 font-bold text-lg border-b-4 transition ${activeTab === "profil"
                            ? "border-[#600000] text-[#600000]"
                            : "border-transparent text-gray-500 hover:text-[#600000]"
                        }`}
                >
                    Profil
                </button>
                <button
                    onClick={() => switchTab("priradenia")}
                    className={`px-8 py-4 font-bold text-lg border-b-4 transition ${activeTab === "priradenia"
                            ? "border-[#600000] text-[#600000]"
                            : "border-transparent text-gray-500 hover:text-[#600000]"
                        }`}
                >
                    Priradenia
                </button>
            </div>

            <div className="animate-fadeIn">
                {activeTab === "profil" ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        <ProfileForm user={user} />
                        <PasswordForm />
                    </div>
                ) : (
                    <AssignmentsList assignments={user.assignments} />
                )}
            </div>
        </div>
    );
}