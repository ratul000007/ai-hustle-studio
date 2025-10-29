"use client";

import { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import StreakTracker from "./components/StreakTracker";
import TaskFilters from "./components/TaskFilters";
import ProgressBar from "./components/ProgressBar";
import CalendarView from "./components/CalendarView";
import ProModal from "./components/ProModal";
import { v4 as uuidv4 } from "uuid";

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [search, setSearch] = useState("");

  // Load saved tasks & dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);

    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // Persist tasks & dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode, tasks]);

  // Notifications for overdue tasks
  useEffect(() => {
    if (!("Notification" in window)) return;
    Notification.requestPermission();
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const due = new Date(task.dueDate);
        if (due < new Date()) {
          new Notification("Task Overdue!", { body: task.text });
        }
      }
    });
  }, [tasks]);

  // Compute progress
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter, sort & search
  const displayedTasks = tasks
    .filter((task) => {
      if (filter === "completed" && !task.completed) return false;
      if (filter === "pending" && task.completed) return false;
      if (search && !task.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const p = { high: 3, medium: 2, low: 1 };
        return (p[b.priority] || 0) - (p[a.priority] || 0);
      }
      if (sortBy === "date") return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      if (sortBy === "overdue") return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      return 0;
    });

  // Export CSV
  const handleExportCSV = () => {
    if (!isProUser) return setShowProModal(true);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Task,Category,Tags,Priority,Recurring,DueDate,Subtasks,Completed"]
        .concat(
          tasks.map(
            (t) =>
              `${t.text},${t.category || ""},${t.tags?.join(";") || ""},${t.priority || ""},${t.recurring || ""},${t.dueDate || ""},"${t.subtasks?.map(st => st.text).join(";") || ""}",${t.completed || false}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add a new task
  const handleAddTask = (task) => {
    const newTask = { ...task, id: uuidv4(), createdAt: new Date().toISOString() };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Hustle Task Manager
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={() => setIsProUser(!isProUser)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            {isProUser ? "Pro" : "Free"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="border px-3 py-2 rounded-md w-full dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="max-w-3xl mx-auto mb-4 flex flex-col gap-2">
        <TaskFilters filter={filter} setFilter={setFilter} />
        <div className="flex justify-between gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white flex-1"
          >
            <option value="none">Sort: None</option>
            <option value="priority">Sort: Priority</option>
            <option value="date">Sort: Due Date</option>
            <option value="overdue">Sort: Overdue</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-4">
        <ProgressBar progress={progressPercent} />
      </div>

      {/* Calendar View */}
      <div className="max-w-3xl mx-auto mb-6">
        <CalendarView tasks={tasks} />
      </div>

      {/* Add Task Form */}
      <div className="max-w-3xl mx-auto mb-6">
        <AddTaskForm onAdd={handleAddTask} isPro={isProUser} onShowPro={() => setShowProModal(true)} />
      </div>

      {/* Task List */}
      <div className="max-w-3xl mx-auto mb-6">
        <TaskList tasks={displayedTasks} setTasks={setTasks} isPro={isProUser} filter={filter} sortBy={sortBy} onShowPro={() => setShowProModal(true)} />
      </div>

      {/* Focus Timer */}
      <div className="max-w-3xl mx-auto mb-6">
        <FocusTimer isPro={isProUser} onShowPro={() => setShowProModal(true)} />
      </div>

      {/* Streak Tracker */}
      <div className="max-w-3xl mx-auto mb-6">
        <StreakTracker tasks={tasks} isPro={isProUser} onShowPro={() => setShowProModal(true)} />
      </div>

      {/* Pro Modal */}
      <ProModal show={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}
