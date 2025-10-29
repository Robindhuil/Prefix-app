"use client";

import { useState } from "react";
import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";
import { Plus } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";

export default function UsersSection() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1); // Re-render UsersTable
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-[#600000] dark:text-[#600000]">
                    {t("adminPanel.usersTab")}
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#600000] to-[#4b0000] text-white rounded-lg font-medium hover:from-[#4b0000] hover:to-[#600000] transition-all hover:scale-105 hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    {t("adminPanel.createUser")}
                </button>
            </div>

            <UsersTable key={refreshKey} />

            <CreateUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    );
}