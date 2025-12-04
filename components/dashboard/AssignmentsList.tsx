// app/dashboard/[id]/components/AssignmentsList.tsx
import { Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const isActive = (start: string, end: string) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    return now >= s && now <= e;
};

export default function AssignmentsList({ assignments, userId }: { assignments: any[]; userId: number }) {
    return (
        <div className="bg-card rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-color">
                <Calendar className="w-8 h-8 cl-text-decor" />
                Tvoje priradenia
            </h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-500 py-16 text-lg">
                    Žiadne priradenia nájdené.
                </p>
            ) : (
                <div className="space-y-6">
                    {assignments.map((a: any) => {
                        const active = isActive(a.workPeriod.startDate, a.workPeriod.endDate);
                        return (
                            <Link
                                key={a.id}
                                href={`/dashboard/${userId}/assignment/${a.id}`}
                                className="block group"
                            >
                                <div className="p-6 pr-10 rounded-2xl border-2 border-custom hover:shadow-2xl transition-all duration-300 bg-linear-to-r input-bg">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-xl line-clamp-2 pr-8 transition-colors ${active ? "text-green-800 dark:text-green-400" : "text-[#600000]"}`}>
                                            {a.workPeriod.title}
                                            {active && (
                                                <span className="ml-3 inline-block">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-800 dark:bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-800 dark:bg-green-400 "></span>
                                                    </span>
                                                </span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${active ? "bg-green-300 dark:bg-green-600 text-green-800" : "bg-[#600000]/10 text-[#600000]"}`}>
                                                #{a.workPeriod.id}
                                            </span>
                                            <ArrowRight className="w-5 h-5 cl-text-decor group-hover:translate-x-2 transition" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-color mt-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
                                        </svg>
                                        {formatDate(a.workPeriod.startDate)} – {formatDate(a.workPeriod.endDate)}
                                        {active && <span className="ml-3 text-green-800 dark:text-green-400 font-bold text-xs">→ AKTÍVNE</span>}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}