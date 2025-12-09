"use client";

import { FileText } from "lucide-react";

export default function EmptyDocuments() {
    return (
        <div className="bg-card rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-card p-3 rounded-2xl">
                        <FileText className="w-10 h-10 cl-text-decor" />
                    </div>
                    <h2 className="text-3xl font-black text-color">
                        Zdieľané dokumenty
                    </h2>
                </div>
                <div className="cl-bg-decor text-white px-6 py-3 rounded-full text-xl font-bold shadow-xl">
                    0
                </div>
            </div>
            <div className="text-center py-12">
                <FileText className="w-20 h-20 mx-auto mb-4 opacity-30 text-color" />
                <p className="text-xl input-text">Nemáte žiadne zdieľané dokumenty</p>
            </div>
        </div>
    );
}
