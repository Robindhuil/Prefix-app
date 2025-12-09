"use client";

import { useState, useTransition } from "react";
import { Calendar, Clock, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { updateWorkingHoursAction } from "@/app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/updateWorkingHoursAction";
import { useRouter } from "next/navigation";

type WorkHoursEntry = {
  id?: number;
  date: string;
  hoursWorked: number;
  note?: string | null;
  editable?: boolean;
};

type Assignment = {
  id: number;
  fromDate: string;
  toDate: string;
  workHours?: WorkHoursEntry[];
};

export default function HourPlanning({
  assignment,
}: {
  assignment: Assignment;
}) {
  const { addToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localHours, setLocalHours] = useState<Record<string, WorkHoursEntry>>(
    {}
  );

  // Generate all dates in the assignment period
  const generateDates = () => {
    const dates: Date[] = [];
    const start = new Date(assignment.fromDate);
    const end = new Date(assignment.toDate);

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const dates = generateDates();

  // Create a map of existing work hours
  const workHoursMap = new Map<string, WorkHoursEntry>();
  assignment.workHours?.forEach((wh) => {
    const dateKey = new Date(wh.date).toISOString().split("T")[0];
    workHoursMap.set(dateKey, wh);
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sk-SK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get day name
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("sk-SK", { weekday: "long" });
  };

  // Check if it's a weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Get hours for a specific date
  const getHoursForDate = (date: Date): WorkHoursEntry => {
    const dateKey = date.toISOString().split("T")[0];
    if (localHours[dateKey]) {
      return localHours[dateKey];
    }
    return (
      workHoursMap.get(dateKey) || {
        date: dateKey,
        hoursWorked: 0,
        note: "",
        editable: true,
      }
    );
  };

  // Update hours locally
  const updateLocalHours = (
    date: Date,
    field: "hoursWorked" | "note",
    value: number | string
  ) => {
    const dateKey = date.toISOString().split("T")[0];
    const current = getHoursForDate(date);
    setLocalHours({
      ...localHours,
      [dateKey]: {
        ...current,
        [field]: field === "hoursWorked" ? Number(value) : value,
      },
    });
  };

  // Save all changed hours to server
  const saveAllHours = async () => {
    if (Object.keys(localHours).length === 0) {
      addToast("Žiadne zmeny na uloženie", "info");
      return;
    }

    startTransition(async () => {
      try {
        const promises = Object.entries(localHours).map(([dateKey, entry]) =>
          updateWorkingHoursAction({
            userAssignmentId: assignment.id,
            date: dateKey,
            hoursWorked: entry.hoursWorked,
            note: entry.note || null,
          })
        );

        const results = await Promise.all(promises);
        const failed = results.filter((r) => !r.success);

        if (failed.length > 0) {
          throw new Error(`Nepodarilo sa uložiť ${failed.length} záznamov`);
        }

        addToast("Všetky hodiny úspešne uložené", "success");
        setLocalHours({});
        router.refresh();
      } catch (error) {
        addToast(
          error instanceof Error ? error.message : "Chyba pri ukladaní hodín",
          "error"
        );
      }
    });
  };

  // Check if there are unsaved changes
  const hasChanges = Object.keys(localHours).length > 0;

  // Calculate total hours
  const totalHours = dates.reduce((sum, date) => {
    const entry = getHoursForDate(date);
    return sum + (entry.hoursWorked || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header with total and Save button */}
      <div className="bg-card rounded-2xl p-6 border-2 border-decor">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-neutral p-3 rounded-xl">
              <Clock className="w-8 h-8 cl-text-decor" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-color">
                Plánovanie pracovných hodín
              </h3>
              <p className="input-text">
                {formatDate(new Date(assignment.fromDate))} –{" "}
                {formatDate(new Date(assignment.toDate))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm input-text">Celkový počet hodín</p>
              <p className="text-4xl font-bold cl-text-decor">
                {totalHours.toFixed(1)}h
              </p>
            </div>
            <button
              onClick={saveAllHours}
              disabled={isPending || !hasChanges}
              className="px-6 py-3 cursor-pointer cl-bg-decor text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ukladám...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Uložiť zmeny {hasChanges && `(${Object.keys(localHours).length})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-3">
        {dates.map((date, index) => {
          const dateKey = date.toISOString().split("T")[0];
          const entry = getHoursForDate(date);
          const weekend = isWeekend(date);
          const hasLocalChanges = localHours[dateKey] !== undefined;
          const isEditable = entry.editable !== false;

          return (
            <div
              key={dateKey}
              className={`bg-card border-2 rounded-xl p-5 transition-all ${
                !isEditable
                  ? "border-red-500 bg-red-50/30 dark:bg-red-900/20 opacity-75"
                  : weekend
                  ? "border-orange-400/50 bg-orange-50/50 dark:bg-orange-900/10"
                  : "border-custom"
              } ${hasLocalChanges ? "ring-2 ring-opacity-50 border-decor" : ""}`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Date info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div
                    className={`bg-neutral p-3 rounded-lg border-2 ${
                      !isEditable
                        ? "border-red-500 text-red-600 dark:text-red-400"
                        : weekend
                        ? "border-orange-400 text-orange-600 dark:text-orange-400"
                        : "border-decor"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-bold text-lg ${
                        !isEditable
                          ? "text-red-600 dark:text-red-400"
                          : weekend
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-color"
                      }`}
                    >
                      {getDayName(date)}
                    </p>
                    <p className="text-sm input-text">{formatDate(date)}</p>
                  </div>
                </div>

                {/* Hours input */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`hours-${dateKey}`} className="input-text">
                      Hodiny:
                    </label>
                    <input
                      id={`hours-${dateKey}`}
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={entry.hoursWorked || ""}
                      onChange={(e) => {
                        updateLocalHours(date, "hoursWorked", e.target.value);
                      }}
                      disabled={!isEditable}
                      className="w-20 px-3 py-2 border-2 border-custom rounded-lg input-bg text-color focus-border focus-ring outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>

                  {/* Note input */}
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      value={entry.note || ""}
                      onChange={(e) => {
                        updateLocalHours(date, "note", e.target.value);
                      }}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border-2 border-custom rounded-lg input-bg text-color focus-border focus-ring outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Poznámka (voliteľné)"
                    />
                  </div>

                  {/* Change indicator or locked status */}
                  {!isEditable ? (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400 whitespace-nowrap">
                      Uzamknuté
                    </span>
                  ) : hasLocalChanges ? (
                    <span className="text-sm font-medium cl-text-decor whitespace-nowrap">
                      Neuložené
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dates.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border-2 border-custom">
          <Calendar className="w-12 h-12 mx-auto mb-4 input-text" />
          <p className="input-text text-lg">
            Žiadne dátumy v tomto pracovnom období
          </p>
        </div>
      )}
    </div>
  );
}
