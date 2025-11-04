// components/adminpanel/workperiods/CreateWorkPeriodForm.tsx
"use client";

import { useState } from "react";
import { createWorkPeriodAction } from "@/app/(root)/adminpanel/workperiods/actions/createWorkPeriodAction";

export default function CreateWorkPeriodForm({ onSuccess }: { onSuccess: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [requirements, setRequirements] = useState({
        WELDER: 0,
        BRICKLAYER: 0,
        OTHER: 0,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const reqs = Object.entries(requirements)
            .filter(([_, count]) => count > 0)
            .map(([profession, count]) => ({ profession, count }));

        const result = await createWorkPeriodAction({
            title,
            description: description || null,
            startDate,
            endDate,
            requirements: reqs,
        });

        if (result.success) {
            setMessage("✅ Karta bola úspešne vytvorená!");
            setTimeout(onSuccess, 1500);
        } else {
            setMessage(`❌ Chyba: ${result.error}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-lg">
            <div>
                <label className="block text-lg font-medium mb-2">Názov karty</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#600000]"
                    placeholder="napr. Stavba XYZ – marec 2025"
                />
            </div>

            <div>
                <label className="block text-lg font-medium mb-2">Popis (voliteľné)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                    placeholder="Krátky popis projektu..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-medium mb-2">Začiatok obdobia</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2">Koniec obdobia</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium mb-4">Požadovaní pracovníci</label>
                <div className="space-y-3">
                    {(["WELDER", "BRICKLAYER", "OTHER"] as const).map((prof) => (
                        <div key={prof} className="flex items-center gap-4">
                            <span className="w-32 font-medium">
                                {prof === "WELDER" ? "Zvárací" :
                                    prof === "BRICKLAYER" ? "Murári" : "Ostatní"}
                            </span>
                            <input
                                type="number"
                                min="0"
                                value={requirements[prof]}
                                onChange={(e) => setRequirements({ ...requirements, [prof]: parseInt(e.target.value) || 0 })}
                                className="w-24 p-2 border border-gray-300 dark:border-gray-700 rounded text-center"
                            />
                            <span>osôb</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#600000] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#4b0000] disabled:opacity-50 transition"
            >
                {loading ? "Vytváram kartu..." : "Vytvoriť kartu obdobia"}
            </button>

            {message && (
                <p className={`text-center text-lg font-semibold p-4 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {message}
                </p>
            )}
        </form>
    );
}