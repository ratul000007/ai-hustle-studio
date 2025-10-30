"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

      <div className="space-y-4">
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

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="w-5 h-5 accent-blue-600"
          />
          <span>Enable Dark Mode</span>
        </div>
      </div>
    </div>
  );
}
