"use client";
import Sidebar from "./components/Sidebar";
import { TaskProvider } from "@/context/TaskContext";
export default function TaskManagerLayout({ children }) {
  return (
    <TaskProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
          {children}
        </main>
      </div>
    </TaskProvider>
  );
}
