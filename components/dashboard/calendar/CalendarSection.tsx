"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthNames = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December"
  ];

  const dayNames = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

  // Get calendar days for the current month
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-card backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
        {/* Header with Year and Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          {/* Year on the left */}
          <div className="text-3xl font-bold cl-text-decor">
            {currentDate.getFullYear()}
          </div>

          {/* Month with navigation arrows in center */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full bg-neutral hover:bg-neutral transition-all duration-300 group"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6 text-color group-hover:cl-text-decor transition-colors" />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-color min-w-[180px] text-center">
              {monthNames[currentDate.getMonth()]}
            </h2>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full bg-neutral hover:bg-neutral transition-all duration-300 group"
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6 text-color group-hover:cl-text-decor transition-colors" />
            </button>
          </div>

          {/* Empty space for balance */}
          <div className="w-24"></div>
        </div>

        {/* Calendar Grid */}
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

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  w-full h-12 p-1 sm:p-1.5 rounded-lg text-center transition-all duration-300
                  flex items-center justify-center text-xs sm:text-sm
                  ${
                    day.isCurrentMonth
                      ? "text-color font-medium"
                      : "text-color opacity-30"
                  }
                  ${
                    day.isToday
                      ? "ring-2 ring-offset-2 ring-offset-card border-decor font-bold"
                      : ""
                  }
                  ${
                    day.isSelected && !day.isToday
                      ? "cl-bg-decor text-white font-bold shadow-lg scale-105"
                      : ""
                  }
                  ${
                    !day.isSelected && !day.isToday
                      ? "bg-neutral hover:bg-neutral hover:scale-105 hover:shadow-md"
                      : ""
                  }
                  ${isWeekend && day.isCurrentMonth ? "opacity-80" : ""}
                `}
                aria-label={day.date.toLocaleDateString()}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="mt-8 p-6 bg-neutral rounded-2xl border-custom">
            <h3 className="text-lg font-semibold cl-text-decor mb-2">
              Vybraný dátum
            </h3>
            <p className="text-color text-xl">
              {selectedDate.toLocaleDateString("sk-SK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
