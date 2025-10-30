"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= numDays; d++) calendarDays.push(new Date(year, month, d));

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const tasksForDay = (date) =>
    tasks.filter((t) => t.date && new Date(t.date).toDateString() === date?.toDateString());

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm text-gray-800 dark:text-gray-200"
        >
          Prev
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm text-gray-800 dark:text-gray-200"
        >
          Next
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, idx) => {
          const dayTasks = tasksForDay(date);
          const isToday = date?.toDateString() === new Date().toDateString();
          return (
            <div
              key={uuidv4()}
              className={`h-14 p-1 border rounded flex flex-col text-[10px] overflow-hidden transition
                ${isToday ? "bg-blue-100 dark:bg-blue-800 border-blue-400 dark:border-blue-600" 
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"}`}
            >
              {/* Date */}
              {date && (
                <div className="font-medium text-sm mb-0.5 text-gray-800 dark:text-gray-100">
                  {date.getDate()}
                </div>
              )}
              
              {/* Tasks */}
              <div className="flex flex-col gap-0.5 overflow-y-auto">
                {dayTasks.map((t) => (
                  <span
                    key={t.id || uuidv4()}
                    className={`px-1 rounded truncate text-[9px] text-white
                      ${t.priority === "high"
                        ? "bg-red-500"
                        : t.priority === "medium"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-green-500"}`}
                  >
                    {t.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
