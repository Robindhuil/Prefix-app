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
    color: "status-active",
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
    color: "status-upcoming",
    badge:
      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: (
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75 animate-pulse"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
      </span>
    ),
    text: "ČAKÁ NA ŠTART",
    labelColor: "text-yellow-700 dark:text-yellow-400",
  },
  ended: {
    color: "status-ended",
    badge:
      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: (
      <span className="relative flex items-center justify-center">
        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
      </span>
    ),
    text: "UKONČENÉ",
    labelColor: "text-blue-700 dark:text-blue-400",
  },
};

// Document shape from Prisma (minimal)
type PrismaDocument = {
  id: number;
  fileName: string;
  mimeType?: string | null;
  size: number;
  documentType: "INVOICE" | "ORDER" | "CONTRACT" | "OTHER";
  createdAt?: string | Date;
  hash?: string | null;
};

type AssignmentDocument = {
  id: number;
  document: PrismaDocument;
};

type Assignment = {
  id: number;
  workPeriod: {
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
  };
  profession: "WELDER" | "BRICKLAYER" | "OTHER";
  fromDate: string;
  toDate: string;
  documents?: AssignmentDocument[]; // <- typed instead of `any`
  // ...other fields as needed
};

// ✅ Pridali sme `user` ako prop
export default function AssignmentDetail({
  assignment,
  user,
  isUserAdmin = false, // <- add this prop
}: {
  assignment: Assignment;
  user?: { name?: string | null; username?: string };
  isUserAdmin?: boolean; // <- add this prop type
}) {
  const { workPeriod, profession, fromDate, toDate } = assignment;
  const status = getStatus(fromDate, toDate);
  const config = statusConfig[status];

  return (
    <div className="w-full space-y-8">
      <div className="w-full pb-16 md:pb-24 pt-6 md:pt-0 mt-5">
        {/* HLAVNÁ KARTA – FAREBNÁ PODĽA STAVU */}
        <div
          className={`relative overflow-hidden rounded-3xl p-10 shadow-2xl border-4 w-full ${config.color} bg-linear-to-br`}
        >
          <div className="absolute inset-0 backdrop-blur-sm" />

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
                <div className="bg-card p-3 rounded-xl">
                  <Briefcase className="w-8 h-8 cl-text-decor" />
                </div>
                <div>
                  <p className="text-sm input-text">Profesia</p>
                  <p className="font-bold text-xl text-color">
                    {profession === "WELDER"
                      ? "Zvárací"
                      : profession === "BRICKLAYER"
                        ? "Murár"
                        : "Ostatné"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-card p-3 rounded-xl">
                  <Calendar className="w-8 h-8 cl-text-decor" />
                </div>
                <div>
                  <p className="text-sm input-text">Projekt</p>
                  <p className="font-bold text-color">
                    {formatDate(workPeriod.startDate)} –{" "}
                    {formatDate(workPeriod.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-card p-3 rounded-xl">
                  <Clock className="w-8 h-8 cl-text-decor" />
                </div>
                <div>
                  {/* 🔽 sem sa teraz vloží meno používateľa */}
                  <p className="text-sm input-text">
                    Nasadenie pre {user?.name ?? "užívateľa"}
                  </p>
                  <p className="font-bold text-color">
                    {formatDate(fromDate)} – {formatDate(toDate)}
                  </p>
                </div>
              </div>
            </div>

            {workPeriod.description && (
              <div className="mt-8 p-6 bg-card rounded-2xl">
                <p className="input-text leading-relaxed">
                  <strong>Popis:</strong> {workPeriod.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NOVÝ KOMPONENT */}
        <SharedDocuments 
          documents={assignment.documents ?? []} 
          assignment={assignment}
          isUserAdmin={isUserAdmin}
        />
      </div>
    </div>
  );
}
