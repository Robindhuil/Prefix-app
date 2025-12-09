"use client";

import { ArrowUpDown } from "lucide-react";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "size-desc" | "size-asc";

type DocumentSortControlsProps = {
    sortBy: SortOption;
    groupByType: boolean;
    onSortChange: (sort: SortOption) => void;
    onGroupChange: (group: boolean) => void;
};

export default function DocumentSortControls({
    sortBy,
    groupByType,
    onSortChange,
    onGroupChange,
}: DocumentSortControlsProps) {
    return (
        <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
                <ArrowUpDown className="w-5 h-5 input-text" />
                <span className="font-medium text-sm input-text">Zoradiť:</span>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="px-4 py-2 rounded-lg text-sm font-medium input-bg input-text border-custom focus:outline-none focus-ring"
                >
                    <option value="newest">Najnovšie</option>
                    <option value="oldest">Najstaršie</option>
                    <option value="name-asc">Názov (A-Z)</option>
                    <option value="name-desc">Názov (Z-A)</option>
                    <option value="size-desc">Veľkosť (najväčšie)</option>
                    <option value="size-asc">Veľkosť (najmenšie)</option>
                </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={groupByType}
                    onChange={(e) => onGroupChange(e.target.checked)}
                    className="w-4 h-4 rounded border-custom focus-ring"
                />
                <span className="text-sm font-medium text-color">
                    Zoskupiť podľa typu
                </span>
            </label>
        </div>
    );
}
