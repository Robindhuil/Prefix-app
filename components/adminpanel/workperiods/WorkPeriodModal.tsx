// components/adminpanel/workperiods/WorkPeriodModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, AlertCircle, Trash2 } from "lucide-react";
import { createWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/createWorkPeriodAction";
import { updateWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/updateWorkPeriodAction";

type Requirement = {
    profession: "WELDER" | "BRICKLAYER" | "OTHER";
    countNeeded: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    initialData?: {
        id: number;
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
        requirements?: Requirement[];
    };
};

const LABELS: Record<Requirement["profession"], string> = {
    WELDER: "Zvárací",
    BRICKLAYER: "Murári",
    OTHER: "Ostatní",
};

export default function WorkPeriodModal({ isOpen, onClose, mode, initialData }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = mode === "edit";

    // Naplnenie pri otvorení
    useEffect(() => {
        if (!isOpen) return;

        if (isEdit && initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            setStartDate(initialData.startDate.split("T")[0]);
            setEndDate(initialData.endDate.split("T")[0]);
            setRequirements(initialData.requirements?.length ? initialData.requirements : []);
        } else {
            setTitle("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setRequirements([]);
            setError("");
        }
    }, [isOpen, isEdit, initialData]);

    const addRow = () => setRequirements(prev => [...prev, { profession: "OTHER", countNeeded: 1 }]);
    const removeRow = (i: number) => setRequirements(prev => prev.filter((_, idx) => idx !== i));
    const updateRow = (i: number, field: "profession" | "countNeeded", value: any) => {
        setRequirements(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startDate || !endDate) return setError("Vyplň názov a dátumy");

        const validReqs = requirements.filter(r => r.countNeeded > 0);
        if (validReqs.length === 0) return setError("Zadaj aspoň jednu profesiu");

        setLoading(true);
        setError("");

        const payload = {
            title,
            description: description || null,
            startDate,
            endDate,
            requirements: validReqs,
        };

        try {
            const result = isEdit
                ? await updateWorkPeriodAction(initialData!.id, payload)
                : await createWorkPeriodAction(payload);

            if (result.success) {
                onClose();
                window.dispatchEvent(new CustomEvent(isEdit ? "workperiod:updated" : "workperiod:created"));
            } else {
                setError(result.error || "Nepodarilo sa uložiť");
            }
        } catch {
            setError("Chyba servera");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="background rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-3 cl-text-decor">
                        {isEdit ? (
                            <>
                                <Edit className="w-6 h-6 text-blue-600" />
                                Upraviť obdobie
                            </>
                        ) : (
                            <>
                                <Plus className="w-6 h-6 text-green-600" />
                                Nové obdobie
                            </>
                        )}
                    </h2>
                    <button onClick={onClose} className="text-3xl interactive-text cursor-pointer">&times;</button>
                </div>

                {/* Formulár */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Názov */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-color">Názov obdobia *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Napíš názov, napr. Letná sezóna 2025"
                            required
                            className="w-full px-4 py-3 border rounded-lg input-text input-bg focus-ring focus-border"
                        />
                    </div>

                    {/* Popis */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-color">Popis (voliteľné)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Krátky popis projektu..."
                            className="w-full px-4 py-3 border rounded-lg input-text input-bg focus-ring focus-border resize-none"
                        />
                    </div>

                    {/* Dátumy */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-color">Začiatok *</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg input-text input-bg focus-ring focus-border border-custom cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-color">Koniec *</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={startDate}
                                required
                                className="w-full px-4 py-3 rounded-lg input-text input-bg focus-ring focus-border border-custom cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Požiadavky */}
                    <div>
                        <h3 className="font-bold mb-3 text-lg text-color">Požadovaní pracovníci</h3>
                        <div className="space-y-3">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border-custom">
                                    <select
                                        value={req.profession}
                                        onChange={e => updateRow(i, "profession", e.target.value as Requirement["profession"])}
                                        className="px-4 py-2 border rounded-lg input-bg focus-ring focus-border cursor-pointer"
                                    >
                                        <option value="WELDER">Zvárací</option>
                                        <option value="BRICKLAYER">Murári</option>
                                        <option value="OTHER">Ostatní</option>
                                    </select>

                                    <input
                                        type="number"
                                        min="1"
                                        value={req.countNeeded}
                                        onChange={e => updateRow(i, "countNeeded", parseInt(e.target.value) || 1)}
                                        className="w-24 px-3 py-2 border rounded-lg text-center input-bg focus-ring focus-border"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeRow(i)}
                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addRow}
                                className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                            >
                                + Pridať profesiu
                            </button>
                        </div>
                    </div>

                    {/* Chyba */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 p-4 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {/* Tlačidlá */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-neutral text-white rounded-lg font-medium cursor-pointer"
                        >
                            Zrušiť
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 cl-bg-decor text-white rounded-lg font-bold flex items-center gap-2 cursor-pointer"
                        >
                            {loading ? "Ukladá sa..." : isEdit ? <>Upraviť</> : <>Vytvoriť</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}