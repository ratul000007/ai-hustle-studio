"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Settings, List, Plus, Sun, Moon } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isProUser, onShowPro, darkMode, setDarkMode, onQuickAdd }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

const navLinks = [
  { name: "Dashboard", path: "/task-manager", icon: <Home size={18} /> },
  { name: "Tasks", path: "/task-manager/tasks", icon: <List size={18} /> },
  { name: "Calendar", path: "/task-manager/calendar", icon: <Calendar size={18} /> },
  { name: "Settings", path: "/task-manager/settings", icon: <Settings size={18} /> },
];

  return (
    <aside
      className={`flex flex-col h-screen bg-white dark:bg-gray-800 shadow-md transition-all
        ${collapsed ? "w-20" : "w-60"} py-6 px-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h1 className="text-2xl font-bold text-blue-600">TaskMaster</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Quick Add Task */}
      {!collapsed && (
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-2 px-3 py-2 mb-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          <Plus size={16} /> Quick Add Task
        </button>
      )}

      {/* Nav Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {navLinks.map(({ name, path, icon, proOnly }) => (
          <Link
            key={path}
            href={path}
            onClick={(e) => {
              if (proOnly && !isProUser) {
                e.preventDefault();
                onShowPro();
              }
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition relative
              ${pathname === path
                ? "bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            title={name}
          >
            {icon}
            {!collapsed && <span>{name}</span>}
            {proOnly && !isProUser && !collapsed && (
              <span className="absolute top-1 right-2 bg-yellow-400 text-black px-1 text-xs rounded">PRO</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="mt-auto flex flex-col gap-2 items-center">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Placeholder for Profile / Greeting */}
        {!collapsed && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            👋 Hello, User
          </div>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-4 text-sm text-gray-400 text-center">
          © 2025 AI Hustle Studio
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
