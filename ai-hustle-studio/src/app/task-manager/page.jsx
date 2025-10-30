"use client";

import { useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import ProgressBar from "./components/ProgressBar";
import CalendarView from "./components/CalendarView";
import StreakTracker from "./components/StreakTracker";
import { v4 as uuidv4 } from "uuid";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPage({ tasks = [] }) {
  const today = new Date().toISOString().split("T")[0];
  const [search, setSearch] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [tasksState, setTasksState] = useState(tasks);

  // Today's Tasks
  const todaysTasks = tasksState.filter((t) => t.date === today);
  const upcomingTasks = tasksState
    .filter((t) => t.date && t.date > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const completedTasks = tasksState.filter((t) => t.completed).length;
  const totalTasks = tasksState.length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Quick Add Task
  const handleQuickAdd = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: uuidv4(),
      text: newTaskText.trim(),
      date: today,
      completed: false,
      category: "Other",
      priority: "medium",
      recurring: "none",
      subtasks: [],
      tags: [],
      notes: "",
    };
    setTasksState([...tasksState, newTask]);
    setNewTaskText("");
  };

  // Pie chart data for task stats by category
  const categoriesData = [
    ...new Map(tasksState.map((t) => [t.category || "Other", t])).values(),
  ].map((t) => ({
    name: t.category || "Other",
    value: tasksState.filter((task) => task.category === t.category).length,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Filtered Today's Tasks
  const filteredTodaysTasks = todaysTasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-10">

      {/* Header + Quick Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Quick add task..."
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

      {/* Search Today's Tasks */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search today's tasks..."
        className="border px-3 py-2 rounded-md w-full md:w-64 dark:bg-gray-700 dark:text-white"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Today’s Tasks</h2>
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

      {/* Progress Section */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Overall Progress</h2>
        <ProgressBar progress={progressPercent} />
      </div>

      {/* Pie Chart */}
      {tasksState.length > 0 && (
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

      {/* Mini Calendar */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Calendar</h2>
        <CalendarView tasks={tasksState} />
      </div>

      {/* Today's Tasks List */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Today’s Tasks</h2>
        {filteredTodaysTasks.length > 0 ? (
          <TaskList
            tasks={filteredTodaysTasks}
            setTasks={setTasksState}
            isPro={false}
            filter="all"
          />
        ) : (
          <p className="text-gray-500">No tasks scheduled for today 🎉</p>
        )}
      </div>

      {/* Upcoming Tasks Preview */}
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
        <StreakTracker tasks={tasksState} isPro={false} onShowPro={() => {}} />
      </div>
    </div>
  );
}
