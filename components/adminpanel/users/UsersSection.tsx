"use client";

import { useState, useCallback } from "react";
import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { Plus } from "lucide-react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import ToggleActiveModal from "./ToggleActiveModal";

export type UserModel = {
    id: number;
    username: string;
    email: string | null;
    name: string | null;
    role: "USER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function UsersSection() {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isBanOpen, setIsBanOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserModel | null>(null);
    const [deletingUser, setDeletingUser] = useState<{ id: number; username: string } | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [banningUser, setBanningUser] = useState<{ id: number; username: string; isActive: boolean } | null>(null);

    const handleSuccess = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const openEdit = (user: UserModel) => {
        setEditingUser(user);
        setIsEditOpen(true);
    };

    const openDelete = (user: { id: number; username: string }) => {
        setDeletingUser(user);
        setIsDeleteOpen(true);
    };

    const openToggleActive = (user: { id: number; username: string; isActive: boolean }) => {
        setBanningUser(user);
        setIsBanOpen(true);
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-[#600000] dark:text-[#600000]">
                    {t("adminPanel.usersTab")}
                </h2>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#600000] to-[#4b0000] text-white rounded-lg font-medium hover:from-[#4b0000] hover:to-[#600000] transition-all hover:scale-105 hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    {t("adminPanel.createUser")}
                </button>
            </div>
            <UsersTable
                key={refreshTrigger}
                onEdit={openEdit}
                onDelete={openDelete}
                onToggleActive={openToggleActive}
            />

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={handleSuccess}
            />

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    isOpen={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false);
                        setEditingUser(null);
                    }}
                    onSuccess={handleSuccess}
                />
            )}

            {deletingUser && (
                <DeleteUserModal
                    user={deletingUser}
                    isOpen={isDeleteOpen}
                    onClose={() => {
                        setIsDeleteOpen(false);
                        setDeletingUser(null);
                    }}
                    onSuccess={handleSuccess}
                />
            )}

            {banningUser && (
                <ToggleActiveModal
                    user={banningUser}
                    isOpen={isBanOpen}
                    onClose={() => {
                        setIsBanOpen(false);
                        setBanningUser(null);
                    }}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}