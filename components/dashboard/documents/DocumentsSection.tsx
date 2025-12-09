"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DocumentFilters from "./DocumentFilters";
import DocumentSortControls from "./DocumentSortControls";
import DocumentGroup from "./DocumentGroup";
import DocumentCard from "./DocumentCard";
import EmptyDocuments from "./EmptyDocuments";

type DocumentType = "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";

type AssignmentLink = {
    userAssignmentId: number;
    userAssignment: {
        id: number;
        workPeriod: {
            title: string;
        };
    };
};

type Document = {
    id: number;
    fileName: string;
    size: number;
    documentType: DocumentType;
    description?: string | null;
    createdAt: string;
    assignmentLinks: AssignmentLink[];
};

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "size-desc" | "size-asc";
type FilterOption = "all" | DocumentType;

export default function DocumentsSection({ documents }: { documents: Document[] }) {
    const params = useParams();
    const userId = params?.id as string;
    
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [filterBy, setFilterBy] = useState<FilterOption>("all");
    const [groupByType, setGroupByType] = useState(false);

    // Filter documents
    const filteredDocs = filterBy === "all" 
        ? documents 
        : documents.filter(doc => doc.documentType === filterBy);

    // Sort documents
    const sortedDocs = [...filteredDocs].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "name-asc":
                return a.fileName.localeCompare(b.fileName);
            case "name-desc":
                return b.fileName.localeCompare(a.fileName);
            case "size-desc":
                return b.size - a.size;
            case "size-asc":
                return a.size - b.size;
            default:
                return 0;
        }
    });

    // Group documents by type if enabled
    const groupedDocs = groupByType
        ? sortedDocs.reduce((acc, doc) => {
            const type = doc.documentType || "OTHER";
            if (!acc[type]) acc[type] = [];
            acc[type].push(doc);
            return acc;
        }, {} as Record<DocumentType, Document[]>)
        : { all: sortedDocs };

    if (documents.length === 0) {
        return <EmptyDocuments />;
    }

    return (
        <div className="bg-card rounded-3xl shadow-2xl p-8 lg:p-12">
            {/* HLAVIČKA */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-card p-3 rounded-2xl">
                        <FileText className="w-10 h-10 cl-text-decor" />
                    </div>
                    <h2 className="text-3xl font-black text-color">
                        Zdieľané dokumenty
                    </h2>
                </div>
                <div className="cl-bg-decor text-white px-6 py-3 rounded-full text-xl font-bold shadow-xl">
                    {filteredDocs.length}
                </div>
            </div>

            {/* FILTERS AND CONTROLS */}
            <div className="mb-8 space-y-4">
                <DocumentFilters 
                    filterBy={filterBy} 
                    onFilterChange={setFilterBy} 
                />
                <DocumentSortControls
                    sortBy={sortBy}
                    groupByType={groupByType}
                    onSortChange={setSortBy}
                    onGroupChange={setGroupByType}
                />
            </div>

            {/* DOCUMENTS */}
            {groupByType && filterBy === "all" ? (
                // Grouped view
                <div className="space-y-8">
                    {(["INVOICE", "ORDER", "CONTRACT", "OTHER"] as DocumentType[]).map((type) => {
                        const docs = (groupedDocs as Record<DocumentType, Document[]>)[type];
                        if (!docs || docs.length === 0) return null;

                        return (
                            <DocumentGroup
                                key={type}
                                type={type}
                                documents={docs}
                                userId={userId}
                            />
                        );
                    })}
                </div>
            ) : (
                // List view
                <div className="space-y-4">
                    {sortedDocs.map(doc => (
                        <DocumentCard key={doc.id} document={doc} userId={userId} />
                    ))}
                </div>
            )}
        </div>
    );
}
