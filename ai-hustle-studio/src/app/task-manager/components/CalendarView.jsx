"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();

  // Build calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= numDays; d++) calendarDays.push(new Date(year, month, d));

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Get tasks for a specific day
  const tasksForDay = (date) =>
    tasks.filter((t) => t.date && new Date(t.date).toDateString() === date?.toDateString());

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">Prev</button>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">Next</button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, idx) => {
          const dayTasks = tasksForDay(date);
          return (
            <div
              key={uuidv4()}
              className={`h-16 p-1 border rounded flex flex-col text-xs dark:text-white transition ${
                date?.toDateString() === new Date().toDateString()
                  ? "bg-blue-100 dark:bg-blue-700"
                  : "bg-gray-50 dark:bg-gray-700"
              }`}
            >
              {date && <div className="font-bold">{date.getDate()}</div>}
              <div className="flex flex-col gap-1 overflow-auto">
                {dayTasks.map((t) => (
                  <span
                    key={t.id || uuidv4()}
                    className={`px-1 rounded text-white text-[10px] truncate ${
                      t.priority === "high"
                        ? "bg-red-500"
                        : t.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
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
