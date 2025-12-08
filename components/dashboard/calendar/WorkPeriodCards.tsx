import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

type Assignment = {
  id: number;
  fromDate: string;
  toDate: string;
  workPeriod: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
  };
};

type WorkPeriodCardsProps = {
  assignments: Assignment[];
  userId: number;
  monthName: string;
};

export default function WorkPeriodCards({
  assignments,
  userId,
  monthName,
}: WorkPeriodCardsProps) {
  const getAssignmentStatus = (
    assignment: Assignment
  ): "active" | "upcoming" | "ended" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workStart = new Date(assignment.workPeriod.startDate);
    const workEnd = new Date(assignment.workPeriod.endDate);
    workStart.setHours(0, 0, 0, 0);
    workEnd.setHours(0, 0, 0, 0);

    if (today >= workStart && today <= workEnd) return "active";
    if (today < workStart) return "upcoming";
    return "ended";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColors = {
    active: {
      titleColor: "text-green-700 dark:text-green-400",
      badgeBg: "bg-green-100 dark:bg-green-900",
      badgeText: "text-green-800 dark:text-green-200",
      label: "→ AKTÍVNE",
      borderColor: "border-green-500",
      dotBg: "bg-green-500",
      dotPing: "bg-green-400",
    },
    upcoming: {
      titleColor: "text-yellow-700 dark:text-yellow-400",
      badgeBg: "bg-yellow-100 dark:bg-yellow-900",
      badgeText: "text-yellow-800 dark:text-yellow-200",
      label: "→ ČAKÁ",
      borderColor: "border-yellow-500",
      dotBg: "bg-yellow-500",
      dotPing: "bg-yellow-400",
    },
    ended: {
      titleColor: "text-blue-700 dark:text-blue-400",
      badgeBg: "bg-blue-100 dark:bg-blue-900",
      badgeText: "text-blue-800 dark:text-blue-200",
      label: "→ UKONČENÉ",
      borderColor: "border-blue-500",
      dotBg: "bg-blue-500",
      dotPing: "bg-blue-400",
    },
  };

  if (assignments.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-color mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 cl-text-decor" />
        Pracovné obdobia v {monthName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
          const colors = statusColors[status];

          return (
            <Link
              key={assignment.id}
              href={`/dashboard/${userId}/assignment/${assignment.id}`}
              className="block group h-full"
            >
              <div
                className={`h-full p-5 rounded-xl border-2 ${colors.borderColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 input-bg flex flex-col`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3 flex-shrink-0">
                      {status === "active" && (
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}
                        ></span>
                      )}
                      {status === "upcoming" && (
                        <span
                          className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${colors.dotPing} opacity-75`}
                        ></span>
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${colors.dotBg}`}
                      ></span>
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${colors.badgeBg} ${colors.badgeText}`}
                    >
                      #{assignment.workPeriod.id}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 cl-text-decor group-hover:translate-x-1 transition flex-shrink-0" />
                </div>

                <h4
                  className={`font-bold text-lg line-clamp-2 mb-3 transition-colors ${colors.titleColor}`}
                >
                  {assignment.workPeriod.title}
                </h4>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-xs text-color">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(assignment.workPeriod.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-color mt-1">
                    <span className="w-4 h-4 flex-shrink-0"></span>
                    <span className="truncate">
                      {formatDate(assignment.workPeriod.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-color mt-2 pt-2">
                    <span className="text-[10px] font-semibold">
                      Tvoje priradenie:
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-color mt-1">
                    <span className="truncate">
                      {formatDate(assignment.fromDate)} -{" "}
                      {formatDate(assignment.toDate)}
                    </span>
                  </div>
                  <span
                    className={`inline-block mt-2 ${colors.titleColor} font-bold text-xs`}
                  >
                    {colors.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
