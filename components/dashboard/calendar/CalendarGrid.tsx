"use client";

import { useState } from "react";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  workPeriodStatus?: "active" | "upcoming" | "ended";
  assignments: Assignment[];
};

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

type CalendarGridProps = {
  calendarDays: CalendarDay[];
  dayNames: string[];
  hoveredDay: CalendarDay | null;
  onMouseEnter: (day: CalendarDay, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
};

export default function CalendarGrid({
  calendarDays,
  dayNames,
  hoveredDay,
  onMouseEnter,
  onMouseLeave,
}: CalendarGridProps) {
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getStatusLabel = (status: "active" | "upcoming" | "ended"): string => {
    if (status === "active") return "AKTÍVNE";
    if (status === "upcoming") return "ČAKÁ";
    return "UKONČENÉ";
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day names header */}
      {dayNames.map((day) => (
        <div
          key={day}
          className="text-center font-semibold text-color py-1.5 text-xs sm:text-sm"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((day, index) => {
        const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
        const hasWorkPeriod = !!day.workPeriodStatus;
        const isHovered = hoveredDay && isSameDay(hoveredDay.date, day.date);
        const hasMultipleAssignments = day.assignments.length > 1;

        // Status-based styling
        let statusClasses = "";
        if (hasWorkPeriod) {
          if (day.workPeriodStatus === "active") {
            statusClasses = "status-active-color";
          } else if (day.workPeriodStatus === "upcoming") {
            statusClasses = "status-upcoming-color";
          } else if (day.workPeriodStatus === "ended") {
            statusClasses = "status-ended-color";
          }
        }

        return (
          <div key={index} className="relative">
            <div
              onMouseEnter={(e) => onMouseEnter(day, e)}
              onMouseLeave={onMouseLeave}
              className={`
                w-full h-12 p-1 sm:p-1.5 rounded-lg text-center transition-all duration-300
                flex flex-col items-center justify-center text-xs sm:text-sm cursor-default relative
                ${statusClasses}
                ${
                  day.isCurrentMonth
                    ? "text-color font-medium"
                    : "text-color opacity-30"
                }
                ${
                  day.isToday
                    ? "ring-2 ring-offset-2 ring-offset-card font-bold"
                    : ""
                }
                ${!hasWorkPeriod ? "bg-neutral" : ""}
                ${
                  hasWorkPeriod
                    ? "hover:scale-105 hover:shadow-lg cursor-pointer"
                    : ""
                }
                ${isWeekend && day.isCurrentMonth ? "opacity-80" : ""}
              `}
              aria-label={day.date.toLocaleDateString()}
            >
              {day.date.getDate()}
              
              {/* Overlap indicator - small dots for multiple assignments */}
              {hasMultipleAssignments && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {day.assignments.slice(0, 3).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1 h-1 rounded-full bg-current opacity-70"
                    />
                  ))}
                  {day.assignments.length > 3 && (
                    <span className="text-[8px] ml-0.5">+</span>
                  )}
                </div>
              )}
            </div>

            {/* Tooltip positioned relative to this cell */}
            {isHovered && hasWorkPeriod && (
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap">
                <div className="bg-card border-custom rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[400px]">
                  {/* Show assignment count if multiple */}
                  {hasMultipleAssignments && (
                    <div className="mb-3 pb-2">
                      <span className="text-xs font-bold text-color">
                        {day.assignments.length} prekrývajúce sa priradenia
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {day.assignments.map((assignment, idx) => {
                      const workStart = new Date(
                        assignment.workPeriod.startDate
                      );
                      const workEnd = new Date(assignment.workPeriod.endDate);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      workStart.setHours(0, 0, 0, 0);
                      workEnd.setHours(0, 0, 0, 0);

                      let status: "active" | "upcoming" | "ended" = "ended";
                      if (today >= workStart && today <= workEnd)
                        status = "active";
                      else if (today < workStart) status = "upcoming";

                      const statusColors = {
                        active: "text-green-600 dark:text-green-400",
                        upcoming: "text-yellow-600 dark:text-yellow-400",
                        ended: "text-blue-600 dark:text-blue-400",
                      };

                      const statusBgColors = {
                        active: "bg-green-500/50",
                        upcoming: "bg-yellow-500/50",
                        ended: "bg-blue-500/50",
                      };

                      return (
                        <div
                          key={idx}
                          className={`
                            ${idx > 0 ? "pt-3" : ""}
                            ${statusBgColors[status]} rounded-lg p-2
                          `}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${statusColors[status].replace('text-', 'bg-')}`} />
                              <h4 className="font-semibold text-color text-sm">
                                {assignment.workPeriod.title}
                              </h4>
                            </div>
                            <span
                              className={`text-xs font-bold ${statusColors[status]}`}
                            >
                              {getStatusLabel(status)}
                            </span>
                          </div>
                          <div className="text-xs text-color opacity-80 space-y-1 whitespace-normal ml-3.5">
                            <div>
                              Pracovné obdobie:{" "}
                              {new Date(
                                assignment.workPeriod.startDate
                              ).toLocaleDateString("sk-SK")}{" "}
                              -{" "}
                              {new Date(
                                assignment.workPeriod.endDate
                              ).toLocaleDateString("sk-SK")}
                            </div>
                            <div>
                              Tvoje priradenie:{" "}
                              {new Date(
                                assignment.fromDate
                              ).toLocaleDateString("sk-SK")}{" "}
                              -{" "}
                              {new Date(assignment.toDate).toLocaleDateString(
                                "sk-SK"
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
