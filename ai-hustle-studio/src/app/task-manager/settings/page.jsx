"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";

export default function SettingsPage() {
  const { clearAllTasks } = useTasks(); // ✅ optional feature from context
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [taskSort, setTaskSort] = useState("date");

  // ✅ Load saved settings on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("taskManagerSettings")) || {};
    setLanguage(savedSettings.language || "en");
    setDarkMode(savedSettings.darkMode || false);
    setAccentColor(savedSettings.accentColor || "#3b82f6");
    setUsername(savedSettings.username || "");
    setNotifications(savedSettings.notifications ?? true);
    setDefaultView(savedSettings.defaultView || "dashboard");
    setTaskSort(savedSettings.taskSort || "date");

    if (savedSettings.darkMode) {
      document.documentElement.classList.add("dark");
    }
    document.documentElement.style.setProperty("--accent-color", savedSettings.accentColor || "#3b82f6");
  }, []);

  // ✅ Save to localStorage whenever settings change
  useEffect(() => {
    const settings = {
      language,
      darkMode,
      accentColor,
      username,
      notifications,
      defaultView,
      taskSort,
    };
    localStorage.setItem("taskManagerSettings", JSON.stringify(settings));
  }, [language, darkMode, accentColor, username, notifications, defaultView, taskSort]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAccentChange = (color) => {
    setAccentColor(color);
    document.documentElement.style.setProperty("--accent-color", color);
  };

  const handleReset = () => {
    if (confirm("⚠️ Are you sure you want to reset all settings and clear all tasks?")) {
      localStorage.removeItem("taskManagerSettings");
      clearAllTasks?.();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">⚙️ App Settings</h1>

      {/* Profile Section */}
      <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">👤 Profile</h2>
        <div>
          <label className="block mb-1 font-medium">Display Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="border rounded-lg px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">🎨 Appearance</h2>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="w-5 h-5 accent-blue-600"
          />
          <span>Enable Dark Mode</span>
        </div>

        <div>
          <label className="block mb-1 font-medium">Accent Color</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => handleAccentChange(e.target.value)}
            className="w-12 h-8 rounded border cursor-pointer"
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">⚡ Preferences</h2>

        <div>
          <label className="block mb-1 font-medium">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="th">ไทย (Thai)</option>
            <option value="bn">বাংলা (Bangla)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Default View</label>
          <select
            value={defaultView}
            onChange={(e) => setDefaultView(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="dashboard">Dashboard</option>
            <option value="tasks">Tasks</option>
            <option value="calendar">Calendar</option>
            <option value="focus">Focus Mode</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Sort Tasks By</label>
          <select
            value={taskSort}
            onChange={(e) => setTaskSort(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5 accent-blue-600"
          />
          <span>Enable Notifications</span>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">⚠️ Danger Zone</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Reset All Settings & Clear Tasks
        </button>
      </section>
    </div>
  );
}
