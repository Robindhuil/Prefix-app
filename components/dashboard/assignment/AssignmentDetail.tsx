import { Calendar, Clock, AlertCircle, Briefcase } from "lucide-react";
import SharedDocuments from "./SharedDocuments";

const formatDate = (date: string) => new Date(date).toLocaleDateString("sk-SK");

// STATUS LOGIKA
type Status = "active" | "upcoming" | "ended";
const getStatus = (from: string, to: string): Status => {
  const now = new Date();
  const start = new Date(from);
  const end = new Date(to);
  if (now >= start && now <= end) return "active";
  if (now < start) return "upcoming";
  return "ended";
};

const statusConfig = {
  active: {
    color: "from-green-500/20 to-green-400/10 border-green-500",
    badge:
      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: (
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
      </span>
    ),
    text: "AKTÍVNE TERAZ",
    labelColor: "text-green-700 dark:text-green-400",
  },
  upcoming: {
    color: "from-orange-500/20 to-orange-400/10 border-orange-500",
    badge:
      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
    text: "ČAKÁ NA ŠTART",
    labelColor: "text-orange-700 dark:text-orange-400",
  },
  ended: {
    color: "from-red-500/20 to-red-400/10 border-red-500",
    badge:
      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    text: "UKONČENÉ",
    labelColor: "text-red-700 dark:text-red-400",
  },
};

// ✅ Pridali sme `user` ako prop
export default function AssignmentDetail({
  assignment,
  user,
}: {
  assignment: any;
  user?: { name?: string | null }; // ✅ pridané | null
}) {
  const { workPeriod, profession, fromDate, toDate, documents } = assignment;
  const status = getStatus(fromDate, toDate);
  const config = statusConfig[status];

  return (
    <div className="space-y-8">
      {/* HLAVNÁ KARTA – FAREBNÁ PODĽA STAVU */}
      <div
        className={`relative overflow-hidden rounded-3xl p-10 shadow-2xl border-4 ${config.color} bg-linear-to-br`}
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm" />

        <div className="relative z-10">
          {/* STATUS BADGE */}
          <div className="flex justify-between items-start mb-6">
            <h1 className={`text-4xl font-bold ${config.labelColor}`}>
              {workPeriod.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className={config.badge}>
                {config.icon}
                <span>{config.text}</span>
              </span>
            </div>
          </div>

          {/* DETAILY */}
          <div className="grid md:grid-cols-3 gap-8 mt-8 text-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl">
                <Briefcase className="w-8 h-8 text-[#600000]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profesia</p>
                <p className="font-bold text-xl">
                  {profession === "WELDER"
                    ? "Zvárací"
                    : profession === "BRICKLAYER"
                      ? "Murár"
                      : "Ostatné"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-[#600000]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Projekt</p>
                <p className="font-bold">
                  {formatDate(workPeriod.startDate)} –{" "}
                  {formatDate(workPeriod.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-[#600000]" />
              </div>
              <div>
                {/* 🔽 sem sa teraz vloží meno používateľa */}
                <p className="text-sm text-gray-600">
                  Nasadenie pre {user?.name ?? "užívateľa"}
                </p>
                <p className="font-bold">
                  {formatDate(fromDate)} – {formatDate(toDate)}
                </p>
              </div>
            </div>
          </div>

          {workPeriod.description && (
            <div className="mt-8 p-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl">
              <p className="text-gray-700 leading-relaxed">
                <strong>Popis:</strong> {workPeriod.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* NOVÝ KOMPONENT */}
      <SharedDocuments documents={assignment.documents} assignment={assignment} />
    </div>
  );
}
