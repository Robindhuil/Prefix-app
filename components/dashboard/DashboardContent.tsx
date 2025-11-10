// app/dashboard/[id]/page.tsx  (alebo DashboardContent.tsx)
"use client";

import { useState, useEffect } from "react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import AssignmentsList from "./AssignmentsList";
import ProfileHeader from "./ProfileHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default function DashboardContent({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<"profil" | "priradenia">("profil");

    // Načítanie z URL
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash === "priradenia") setActiveTab("priradenia");
    }, []);

    // Prepínanie + URL
    const switchTab = (tab: "profil" | "priradenia") => {
        setActiveTab(tab);
        window.history.replaceState(null, "", `#${tab}`);
    };

    // Globálna funkcia pre sidebar
    useEffect(() => {
        (window as any).switchDashboardTab = switchTab;
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* SIDEBAR */}
            <DashboardSidebar />

            {/* HLAVNÝ OBSAH */}
            <main className="flex-1 pb-16 md:pb-24 pt-6 md:pt-0 mt-5">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-card backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-12">

                        {/* HEADER */}
                        <ProfileHeader user={user} />

                        {/* TABS */}
                        <div className="border-b border-gray-600 mb-6">
                            <div className="flex gap-8 -mb-px">
                                {[
                                    { key: "profil", label: "Profil" },
                                    { key: "priradenia", label: "Priradenia" },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => switchTab(key as any)}
                                        className={`
                      px-6 py-3 text-lg font-semibold border-b-4 transition-all duration-300 cursor-pointer
                      ${activeTab === key
                                                ? "cl-text-decor"
                                                : "border-transparent interactive-text"
                                            }
                    `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* OBSAH */}
                        <div className="animate-in fade-in duration-300">
                            {activeTab === "profil" ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <ProfileForm user={user} />
                                    <PasswordForm />
                                </div>
                            ) : (
                                <AssignmentsList assignments={user.assignments} userId={user.id} />
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}