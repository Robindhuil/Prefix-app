"use client";

import { useState, ReactNode } from "react";
import { FileText, Clock } from "lucide-react";

type Tab = "documents" | "hours";

type AssignmentTabsProps = {
  documentsContent: ReactNode;
  hoursContent: ReactNode;
};

export default function AssignmentTabs({
  documentsContent,
  hoursContent,
}: AssignmentTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("documents");

  const tabs = [
    {
      id: "documents" as Tab,
      label: "Zdieľané dokumenty",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "hours" as Tab,
      label: "Plánovanie hodín",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full mt-8">
      {/* Tab Header */}
      <div className="bg-card border-2 border-border rounded-t-2xl p-2 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-linear-to-r cl-bg-decor text-white shadow-lg scale-105"
                : "bg-neutral text-white"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border-2 border-t-0 border-border rounded-b-2xl p-6">
        {activeTab === "documents" && documentsContent}
        {activeTab === "hours" && hoursContent}
      </div>
    </div>
  );
}
