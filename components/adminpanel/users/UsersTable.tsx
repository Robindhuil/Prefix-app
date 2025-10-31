"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { format } from "date-fns";
import {
    User, Mail, Calendar, Edit, Shield, Pencil, Trash2, Check, X, Ban, CheckCircle,
    ArrowUpDown, ArrowUp, ArrowDown, Search
} from "lucide-react";
import type { UserModel } from "./UsersSection";
import { getUsersAction } from "@/app/(root)/adminpanel/users/actions/getUsersAction";

type SortKey = "id" | "username" | "email" | "name" | "role" | "isActive" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

type UsersTableProps = {
    onEdit: (user: UserModel) => void;
    onDelete: (user: { id: number; username: string }) => void;
    onToggleActive: (user: { id: number; username: string; isActive: boolean }) => void;
};

export default function UsersTable({ onEdit, onDelete, onToggleActive }: UsersTableProps) {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        const result = await getUsersAction();
        if (result.success) {
            setUsers(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Live filter + sort (useMemo pre výkon)
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users;

        // === VYHĽADÁVANIE ===
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = users.filter(user =>
                user.id.toString().includes(query) ||
                user.username.toLowerCase().includes(query) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (user.name && user.name.toLowerCase().includes(query)) ||
                user.role.toLowerCase().includes(query)
            );
        }

        // === ZORADENIE ===
        return [...filtered].sort((a, b) => {
            let aValue: any = a[sortKey];
            let bValue: any = b[sortKey];

            if (sortKey === "isActive") {
                aValue = a.isActive ? 1 : 0;
                bValue = b.isActive ? 1 : 0;
            }

            if (typeof aValue === "string" || typeof bValue === "string") {
                const aStr = (aValue || "").toString().toLowerCase();
                const bStr = (bValue || "").toString().toLowerCase();

                if (aStr === "" && bStr !== "") return 1;
                if (bStr === "" && aStr !== "") return -1;
                if (aStr === "" && bStr === "") return 0;

                if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
                if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
                return 0;
            }

            if (aValue == null && bValue != null) return 1;
            if (bValue == null && aValue != null) return -1;
            if (aValue == null && bValue == null) return 0;

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [users, searchQuery, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 opacity-40 ml-1" />;
        return sortOrder === "asc"
            ? <ArrowUp className="w-4 h-4 ml-1 text-[#600000]" />
            : <ArrowDown className="w-4 h-4 ml-1 text-[#600000]" />;
    };

    if (loading) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t("common.loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-[#600000] dark:text-[#600000] flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {t("adminPanel.usersList")}
                </h3>

                {/* VYHĽADÁVACÍ INPUT */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t("adminPanel.table.filter.searchPlaceholder") || "Hľadať v používateľoch..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#600000]/50 focus:border-[#600000] transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("adminPanel.totalUsers")} {filteredAndSortedUsers.length}
                    {searchQuery && ` (${t("adminPanel.table.filter.filtered")})`}
                </span>
            </div>

            {filteredAndSortedUsers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? t("adminPanel.table.filter.noResults") : t("adminPanel.noUsers")}
                    </p>
                </div>
            ) : (
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("id")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        {t("adminPanel.table.id")}
                                        {getSortIcon("id")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("username")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        {t("adminPanel.table.username")}
                                        {getSortIcon("username")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("email")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        {t("adminPanel.table.email")}
                                        {getSortIcon("email")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("name")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        {t("adminPanel.table.name")}
                                        {getSortIcon("name")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("role")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        {t("adminPanel.table.role")}
                                        {getSortIcon("role")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("isActive")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        {t("adminPanel.table.isActive")}
                                        {getSortIcon("isActive")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("createdAt")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        {t("adminPanel.table.created")}
                                        {getSortIcon("createdAt")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort("updatedAt")}
                                        className="flex items-center gap-1 hover:text-[#600000] dark:hover:text-[#600000] transition-colors font-semibold"
                                    >
                                        <Edit className="w-4 h-4 inline mr-1" />
                                        {t("adminPanel.table.updated")}
                                        {getSortIcon("updatedAt")}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t("adminPanel.table.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredAndSortedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        #{user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {user.email || (
                                            <span className="text-gray-400 dark:text-gray-600 italic">
                                                {t("adminPanel.table.noEmail")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.name || (
                                            <span className="text-gray-400 dark:text-gray-600 italic">
                                                {t("adminPanel.table.noName")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "ADMIN"
                                                ? "bg-[#600000]/10 text-[#600000] dark:bg-[#600000]/20"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center align-middle">
                                        <div className="w-6 flex justify-center">
                                            {user.isActive ? (
                                                <Check className="text-green-500 w-5 h-5 -translate-x-[0.5px]" />
                                            ) : (
                                                <X className="text-red-500 w-5 h-5 -translate-x-[0.5px]" />
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(user.createdAt), "dd.MM.yyyy HH:mm")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(user.updatedAt), "dd.MM.yyyy HH:mm")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="text-[#0996e2] hover:text-[#00659b] cursor-pointer dark:text-[#0073b1] hover:dark:text-[#00659b] transition-colors"
                                                title={t("adminPanel.edit")}
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onToggleActive({ id: user.id, username: user.username, isActive: user.isActive })}
                                                className={`transition-colors cursor-pointer ${user.isActive
                                                    ? "text-orange-600 hover:text-orange-800 dark:text-orange-500 dark:hover:text-orange-400"
                                                    : "text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                                                    }`}
                                                title={user.isActive ? t("adminPanel.banUser") : t("adminPanel.activateUser")}
                                            >
                                                {user.isActive ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => onDelete({ id: user.id, username: user.username })}
                                                className="text-red-600 hover:text-red-800 cursor-pointer dark:text-red-500 dark:hover:text-red-400 transition-colors"
                                                title={t("adminPanel.delete")}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}