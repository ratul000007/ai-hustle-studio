"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { TaskProvider } from "@/context/TaskContext";

// Optional: Dark mode persistence
export default function TaskManagerLayout({ children }) {
  const [theme, setTheme] = useState("light");

  // Load preferred theme on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Save theme preference
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <TaskProvider>
      <div className="flex min-h-screen transition-colors duration-300">
        {/* Sidebar stays persistent */}
        <Sidebar theme={theme} toggleTheme={toggleTheme} />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}
