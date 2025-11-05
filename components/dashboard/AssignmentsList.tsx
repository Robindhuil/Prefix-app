// app/dashboard/[id]/components/AssignmentsList.tsx
import { Calendar } from "lucide-react";

export default function AssignmentsList({ assignments }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-[#600000]" />
                Tvoje priradenia
            </h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-500 py-10 text-lg">
                    Zatiaľ nemáš žiadne priradenia. Čoskoro ti ich pridáme! 🚧
                </p>
            ) : (
                <div className="grid gap-5">
                    {assignments.map((a: any) => (
                        <div
                            key={a.id}
                            className="p-6 border-2 border-[#600000]/10 rounded-xl hover:shadow-md transition bg-gradient-to-r from-[#600000]/5 to-transparent"
                        >
                            <h3 className="font-bold text-xl text-[#600000]">{a.workPeriod.title}</h3>
                            <p className="text-gray-600 mt-2">
                                📅 {new Date(a.workPeriod.startDate).toLocaleDateString("sk-SK")} –{" "}
                                {new Date(a.workPeriod.endDate).toLocaleDateString("sk-SK")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}