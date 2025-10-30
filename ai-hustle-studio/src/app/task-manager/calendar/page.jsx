"use client";

import CalendarView from "../components/CalendarView";

export default function CalendarPage({ tasks = [] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📅 Calendar</h1>
      <CalendarView tasks={tasks} />
    </div>
  );
}
