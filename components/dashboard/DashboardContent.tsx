// app/dashboard/[id]/page.tsx  (alebo DashboardContent.tsx)
"use client";

import { useState, useEffect } from "react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import AssignmentsList from "./AssignmentsList";
import ProfileHeader from "./ProfileHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CalendarSection from "@/components/dashboard/calendar/CalendarSection";
import DocumentsSection from "@/components/dashboard/documents/DocumentsSection";
import { getDocumentsForUser } from "@/app/(root)/dashboard/[id]/documents/actions/documentListAction";


type Assignment = {
    id: number;
    fromDate: string;
    toDate: string;
    workPeriod: {
        id: number;
        title: string;
        startDate: string;
        endDate: string;
    };
};

type Document = {
    id: number;
    fileName: string;
    size: number;
    documentType: "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";
    description?: string | null;
    createdAt: string;
    assignmentLinks: {
        userAssignmentId: number;
        userAssignment: {
            id: number;
            workPeriod: {
                title: string;
            };
        };
    }[];
};

type User = {
    id: number;
    username: string;
    assignments: Assignment[];
    // Add other user fields as needed
};

type TabKey = "profil" | "priradenia" | "kalendar" | "dokumenty";

export default function DashboardContent({ user, canEditSensitive = false }: { user: User; canEditSensitive?: boolean }) {
    // Initialize from location.hash on first render (client-only component)
    const [activeTab, setActiveTab] = useState<TabKey>(() => {
        if (typeof window === "undefined") return "profil";
        const hash = window.location.hash.slice(1);
        return (hash === "priradenia" || hash === "profil" || hash === "kalendar" || hash === "dokumenty") ? (hash as TabKey) : "profil";
    });

    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);

    // Fetch documents when documents tab is active
    useEffect(() => {
        if (activeTab === "dokumenty" && documents.length === 0) {
            setIsLoadingDocs(true);
            getDocumentsForUser(user.id)
                .then(setDocuments)
                .catch(err => console.error("Failed to load documents:", err))
                .finally(() => setIsLoadingDocs(false));
        }
    }, [activeTab, user.id, documents.length]);

    // Prepínanie + URL
    const switchTab = (tab: TabKey) => {
        setActiveTab(tab);
        window.history.replaceState(null, "", `#${tab}`);
    };

    // Listen for hash changes (e.g., from back button or direct navigation)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash === "priradenia" || hash === "profil" || hash === "kalendar" || hash === "dokumenty") {
                setActiveTab(hash as TabKey);
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
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
                                    { key: "kalendar", label: "Kalendár" },
                                    { key: "dokumenty", label: "Dokumenty" },
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => switchTab(key as TabKey)}
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
                                    {canEditSensitive && <PasswordForm />}
                                </div>
                            ) : activeTab === "priradenia" ? (
                                <AssignmentsList assignments={user.assignments} userId={user.id} />
                            ) : activeTab === "kalendar" ? (
                                <CalendarSection assignments={user.assignments} userId={user.id} />
                            ) : isLoadingDocs ? (
                                <div className="text-center py-12">
                                    <p className="text-xl input-text">Načítavam dokumenty...</p>
                                </div>
                            ) : (
                                <DocumentsSection documents={documents} />
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}