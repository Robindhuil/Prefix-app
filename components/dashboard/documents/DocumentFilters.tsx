"use client";

import { Filter } from "lucide-react";
import {
    FileText,
    FileSignature,
    FileSpreadsheet,
    FileArchive,
} from "lucide-react";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";
type FilterOption = "all" | DocumentType;

const documentConfig = {
    INVOICE: {
        label: "Faktúra",
        icon: FileSpreadsheet,
    },
    ORDER: {
        label: "Objednávka",
        icon: FileArchive,
    },
    CONTRACT: {
        label: "Zmluva",
        icon: FileSignature,
    },
    OTHER: {
        label: "Ostatné",
        icon: FileText,
    },
};

type DocumentFiltersProps = {
    filterBy: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
};

export default function DocumentFilters({ filterBy, onFilterChange }: DocumentFiltersProps) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 input-text" />
            <span className="font-medium text-sm input-text">Typ:</span>
            {(["all", "INVOICE", "ORDER", "CONTRACT", "OTHER"] as const).map((type) => {
                const config = type === "all" ? null : documentConfig[type];
                const label = type === "all" ? "Všetky" : config?.label || type;
                
                return (
                    <button
                        key={type}
                        onClick={() => onFilterChange(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filterBy === type
                                ? "cl-bg-decor text-white shadow-lg"
                                : "input-bg input-text hover:bg-neutral"
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
