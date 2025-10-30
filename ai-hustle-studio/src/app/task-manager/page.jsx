"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext"; // ✅ shared context
import ProgressBar from "./components/ProgressBar";
import CalendarView from "./components/CalendarView";
import StreakTracker from "./components/StreakTracker";
import TaskList from "./components/TaskList";
import { v4 as uuidv4 } from "uuid";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { tasks, addTask, toggleComplete } = useTasks(); // ✅ from context
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);

  // --- Derived Data ---
  const todaysTasks = tasks.filter((t) => t.date === selectedDate);
  const upcomingTasks = tasks
    .filter((t) => t.date && t.date > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // --- Quick Add ---
  const handleQuickAdd = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: uuidv4(),
      text: newTaskText.trim(),
      date: selectedDate,
      completed: false,
      category: "General",
      priority: "medium",
      recurring: "none",
      subtasks: [],
      tags: [],
      notes: "",
    };
    addTask(newTask); // ✅ global update
    setNewTaskText("");
  };

  // --- Pie Chart Data ---
  const categoryCount = tasks.reduce((acc, t) => {
    const cat = t.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoriesData = Object.keys(categoryCount).map((key) => ({
    name: key,
    value: categoryCount[key],
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#E91E63"];

  // --- Filtered Tasks ---
  const filteredTasks = todaysTasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-10">

      {/* Header + Quick Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={`Quick add for ${selectedDate}...`}
            className="border px-3 py-2 rounded-md w-full md:w-64 dark:bg-gray-700 dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          />
          <button
            onClick={handleQuickAdd}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search tasks for ${selectedDate}...`}
        className="border px-3 py-2 rounded-md w-full md:w-64 dark:bg-gray-700 dark:text-white"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Tasks on {selectedDate}</h2>
          <p className="text-2xl font-bold mt-2">{todaysTasks.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Upcoming Tasks</h2>
          <p className="text-2xl font-bold mt-2">{upcomingTasks.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Completed</h2>
          <p className="text-2xl font-bold mt-2">{completedTasks}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Overall Progress</h2>
        <ProgressBar progress={progressPercent} />
      </div>

      {/* Pie Chart */}
      {categoriesData.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold mb-3">Tasks by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoriesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Calendar (now interactive!) */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Calendar</h2>
        <CalendarView
          tasks={tasks}
          selectedDate={selectedDate}
          onDateSelect={(date) => setSelectedDate(date)} // ✅ now clickable
        />
      </div>

      {/* Tasks List */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Tasks for {selectedDate}</h2>
        {filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} onToggleComplete={toggleComplete} />
        ) : (
          <p className="text-gray-500">No tasks scheduled 🎉</p>
        )}
      </div>

      {/* Upcoming Preview */}
      {upcomingTasks.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold mb-3">Upcoming Tasks</h2>
          <ul className="space-y-2">
            {upcomingTasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-2 border rounded-md dark:border-gray-700"
              >
                <span>{task.text}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{task.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Streak Tracker */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <StreakTracker tasks={tasks} />
      </div>
    </div>
  );
}
