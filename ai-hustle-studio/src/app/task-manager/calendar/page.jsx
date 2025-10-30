"use client";

import CalendarView from "../components/CalendarView";
import { useTasks } from "@/context/TaskContext";

export default function CalendarPage() {
  const { tasks, setTasks, isPro } = useTasks(); // get tasks from global context

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📅 Calendar</h1>
      <CalendarView tasks={tasks} setTasks={setTasks} isPro={isPro} />
    </div>
  );
}
