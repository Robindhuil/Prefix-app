"use client";

import { useState, useEffect } from "react";
import { assignUserToWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/assignUserToWorkPeriodAction";
import { searchUsersAction } from "@/app/(root)/adminpanel/workperiods/actions/searchUsersAction";
import { removeAssignmentAction } from "@/app/(root)/adminpanel/workperiods/actions/removeAssignmentAction";
import { Profession } from "@/app/generated/prisma/client";
export default function AssignedUsersTable({
    periodId,
    assignments,
    startDate,
    endDate,
}: {
    periodId: number;
    startDate: string;
    endDate: string;
    assignments: {
        user: { id: number; username: string; name: string | null };
        fromDate: string;
        toDate: string;
        profession: Profession;
    }[];
}) {
    const [adding, setAdding] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<
        { id: number; username: string; name: string | null }[]
    >([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(endDate);
    const [profession, setProfession] = useState<Profession>(Profession.OTHER);
    const [message, setMessage] = useState("");

    // 🔍 Dynamické vyhľadávanie používateľov
    useEffect(() => {
        const fetchUsers = async () => {
            if (search.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            const res = await searchUsersAction(search);
            if (res.success) setSearchResults(res.users);
        };
        const delay = setTimeout(fetchUsers, 300);
        return () => clearTimeout(delay);
    }, [search]);

    // ➕ Pridanie používateľa
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setMessage("Vyber používateľa.");
            return;
        }
        setAdding(true);
        setMessage("");

        const res = await assignUserToWorkPeriodAction({
            userId,
            workPeriodId: periodId,
            fromDate,
            toDate,
            profession,
        });

        if (res.success) {
            setMessage("✅ Pracovník pridaný.");
            setSearch("");
            setSearchResults([]);
            setUserId(null);
            setProfession(Profession.OTHER);
            setFromDate(startDate);
            setToDate(endDate);
            window.dispatchEvent(new Event("assignment:changed"));
        } else {
            setMessage(`❌ ${res.error}`);
        }
        setAdding(false);
    };

    // ❌ Odstránenie používateľa
    const handleRemove = async (userId: number) => {
        if (!confirm("Naozaj chceš odstrániť tohto používateľa z obdobia?")) return;
        const res = await removeAssignmentAction({ userId, workPeriodId: periodId });
        if (res.success) {
            setMessage("✅ Pracovník odstránený.");
            window.dispatchEvent(new Event("assignment:changed"));
        } else {
            setMessage(`❌ ${res.error}`);
        }
    };

    // 🗓️ Formátovanie dátumu
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mt-6 mb-6 space-y-6">
            {/* FORMULÁR */}
            <form
                onSubmit={handleAdd}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 relative"
            >
                {/* Vyhľadávanie */}
                <div className="col-span-2 relative">
                    <input
                        type="text"
                        placeholder="Vyhľadaj používateľa (meno alebo @username)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 max-h-56 overflow-y-auto shadow-lg">
                            {searchResults.map((u) => {
                                const displayName = u.name
                                    ? `${u.name} (${u.username})`
                                    : `noname (${u.username})`;
                                return (
                                    <li
                                        key={u.id}
                                        onClick={() => {
                                            setUserId(u.id);
                                            setSearch(displayName);
                                            setSearchResults([]);
                                        }}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        {displayName}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Profesie */}
                <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value as Profession)}
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                    <option value={Profession.WELDER}>Zvárač</option>
                    <option value={Profession.BRICKLAYER}>Murár</option>
                    <option value={Profession.OTHER}>Ostatné</option>
                </select>

                {/* Dátumy */}
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                />

                {/* Tlačidlo */}
                <button
                    type="submit"
                    disabled={adding}
                    className="bg-[#600000] text-white rounded-lg font-bold hover:bg-[#4b0000] transition px-4 py-3 disabled:opacity-50"
                >
                    {adding ? "Pridávam..." : "Pridať"}
                </button>
            </form>

            {/* Správa */}
            {message && (
                <p
                    className={`text-center text-sm font-medium ${message.includes("✅")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )}

            {/* ZOZNAM PRIRADENÝCH */}
            <div className="mt-8">
                {assignments.length === 0 ? (
                    <p className="text-gray-500 italic">
                        Zatiaľ nikto nie je priradený
                    </p>
                ) : (
                    <div className="space-y-3">
                        {assignments.map((a) => (
                            <div
                                key={a.user.id}
                                className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    <p className="font-medium">
                                        {a.user.name || a.user.username} (@
                                        {a.user.username})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {a.profession === "WELDER"
                                            ? "Zvárač"
                                            : a.profession === "BRICKLAYER"
                                                ? "Murár"
                                                : "Ostatné"}{" "}
                                        • {formatDate(a.fromDate)} –{" "}
                                        {formatDate(a.toDate)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemove(a.user.id)}
                                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                                >
                                    Odstrániť
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
