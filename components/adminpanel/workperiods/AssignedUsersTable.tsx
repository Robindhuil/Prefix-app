"use client";

import { useState, useEffect } from "react";
import { assignUserToWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/assignUserToWorkPeriodAction";
import { updateAssignmentAction } from "@/app/(root)/adminpanel/workperiods/actions/updateAssignmentAction";
import { searchUsersAction } from "@/app/(root)/adminpanel/workperiods/actions/searchUsersAction";
import { removeAssignmentAction } from "@/app/(root)/adminpanel/workperiods/actions/removeAssignmentAction";
import { Profession } from "@/app/generated/prisma/client";
import RemoveAssignmentModal from "./RemoveAssignmentModal";

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
    const [editingAssignment, setEditingAssignment] = useState<null | {
        userId: number;
        profession: Profession;
        fromDate: string;
        toDate: string;
    }>(null);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<
        { id: number; username: string; name: string | null }[]
    >([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(endDate);
    const [profession, setProfession] = useState<Profession>(Profession.OTHER);
    const [message, setMessage] = useState("");
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number; username: string; name?: string | null } | null>(null);


    // 🔍 Vyhľadávanie používateľov
    useEffect(() => {
        const fetchUsers = async () => {
            if (search.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            const res = await searchUsersAction(search);
            if (res.success) {
                // ❌ odfiltrujeme už priradených
                const assignedIds = assignments.map((a) => a.user.id);
                const filtered = res.users.filter((u) => !assignedIds.includes(u.id));
                setSearchResults(filtered);
            }
        };
        const delay = setTimeout(fetchUsers, 300);
        return () => clearTimeout(delay);
    }, [search, assignments]);

    // ➕ Pridanie alebo ✏️ úprava
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setMessage("Vyber používateľa.");
            return;
        }
        setAdding(true);
        setMessage("");

        let res;
        if (editingAssignment) {
            res = await updateAssignmentAction({
                userId,
                workPeriodId: periodId,
                fromDate,
                toDate,
                profession,
            });
        } else {
            res = await assignUserToWorkPeriodAction({
                userId,
                workPeriodId: periodId,
                fromDate,
                toDate,
                profession,
            });
        }

        if (res.success) {
            setMessage(editingAssignment ? "✅ Údaje upravené." : "✅ Pracovník pridaný.");
            setSearch("");
            setSearchResults([]);
            setUserId(null);
            setProfession(Profession.OTHER);
            setFromDate(startDate);
            setToDate(endDate);
            setEditingAssignment(null);
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

    // 🖊️ Spustenie editácie
    const handleEdit = (a: any) => {
        setEditingAssignment({
            userId: a.user.id,
            profession: a.profession,
            fromDate: a.fromDate.split("T")[0],
            toDate: a.toDate.split("T")[0],
        });
        setUserId(a.user.id);
        setSearch(`${a.user.name || "noname"} (${a.user.username})`);
        setProfession(a.profession);
        setFromDate(a.fromDate.split("T")[0]);
        setToDate(a.toDate.split("T")[0]);
        setSearchResults([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    return (
        <div className="bg-card p-6 rounded-xl mt-6 mb-6 space-y-6">
            {/* FORMULÁR */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 relative"
            >
                {/* Vyhľadávanie */}
                <div className="col-span-2 relative">
                    <input
                        type="text"
                        placeholder="Vyhľadaj používateľa (meno alebo @username)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!!editingAssignment}
                        className="w-full p-3 rounded-lg border-custom focus-ring focus-border input-text input-bg"
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full background border border-decor text-color rounded-lg mt-1 max-h-56 overflow-y-auto shadow-lg">
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
                                        className="px-4 py-2 bg-neutral text-white cursor-pointer"
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
                    className="p-3 rounded-lg input-bg input-text border-custom focus-border focus-ring cursor-pointer"
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
                    className="p-3 rounded-lg input-text input-bg focus-ring focus-border border-custom cursor-pointer"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="p-3 rounded-lg input-text input-bg focus-ring focus-border border-custom cursor-pointer"
                />

                {/* Tlačidlo */}
                <button
                    type="submit"
                    disabled={adding}
                    className=" text-white rounded-lg font-bold cl-bg-decor transition px-4 py-3 disabled:opacity-50 cursor-pointer"
                >
                    {adding
                        ? "Ukladám..."
                        : editingAssignment
                            ? "Uložiť zmeny"
                            : "Pridať"}
                </button>

                {/* Reset editácie */}
                {editingAssignment && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingAssignment(null);
                            setSearch("");
                            setUserId(null);
                            setFromDate(startDate);
                            setToDate(endDate);
                            setProfession(Profession.OTHER);
                        }}
                        className="text-white bg-neutral rounded-lg font-medium  transition px-4 py-3"
                    >
                        Zrušiť
                    </button>
                )}
            </form>

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

            {/* ZOZNAM */}
            <div className="mt-8 space-y-3">
                {assignments.length === 0 ? (
                    <p className="input-text italic">
                        Zatiaľ nikto nie je priradený
                    </p>
                ) : (
                    assignments.map((a) => (
                        <div
                            key={a.user.id}
                            className="flex items-center justify-between bg-card p-4 rounded-lg border-custom"
                        >
                            <div>
                                <p className="font-medium cl-text-decor">
                                    {a.user.name || "noname"} (@{a.user.username})
                                </p>
                                <p className="text-sm input-text">
                                    {a.profession === "WELDER"
                                        ? "Zvárač"
                                        : a.profession === "BRICKLAYER"
                                            ? "Murár"
                                            : "Ostatné"}{" "}
                                    • {formatDate(a.fromDate)} – {formatDate(a.toDate)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(a)}
                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 cursor-pointer"
                                >
                                    Upraviť
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedUser(a.user);
                                        setShowRemoveModal(true);
                                    }}
                                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Odstrániť
                                </button>
                                <RemoveAssignmentModal
                                    isOpen={showRemoveModal}
                                    onClose={() => setShowRemoveModal(false)}
                                    user={selectedUser}
                                    workPeriodId={periodId}
                                    onSuccess={() => window.dispatchEvent(new Event("assignment:changed"))}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
