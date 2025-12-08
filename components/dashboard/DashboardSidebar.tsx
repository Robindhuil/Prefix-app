// components/dashboard/DashboardSidebar.tsx
"use client";

import { User, Calendar, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const switchTab = (tab: "profil" | "priradenia" | "kalendar") => {
    // Navigate to base dashboard with hash
    router.push(`/dashboard/${userId}#${tab}`);
    setIsOpen(false);
  };

  return (
    <>
      <input type="checkbox" id="nav-toggle" className="hidden peer" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
      <label htmlFor="nav-toggle" className="fixed top-4 left-4 z-50 md:hidden dark:bg-gray-800 p-3 rounded-full shadow-xl cursor-pointer">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 dark:bg-gray-800 shadow-2xl transform transition ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold cl-text-decor mb-10">Dashboard</h2>

          <nav className="space-y-6 flex-1">
            <button
              onClick={() => switchTab("profil")}
              className="cursor-pointer w-full flex items-center gap-3 text-lg font-medium text-left text-hover-decor transition hover:pl-2"
            >
              <User className="w-6 h-6" />
              <span>Profil</span>
            </button>

            <button
              onClick={() => switchTab("priradenia")}
              className="cursor-pointer w-full flex items-center gap-3 text-lg font-medium text-left text-hover-decor transition hover:pl-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Priradenia</span>
            </button>

            <button
              onClick={() => switchTab("kalendar")}
              className="cursor-pointer w-full flex items-center gap-3 text-lg font-medium text-left text-hover-decor transition hover:pl-2"
            >
              <CalendarDays className="w-6 h-6" />
              <span>Kalendár</span>
            </button>
          </nav>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}