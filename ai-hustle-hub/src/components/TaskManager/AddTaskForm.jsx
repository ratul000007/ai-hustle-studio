"use client";

import { useState, useRef, useEffect } from "react";

const DEFAULT_CATEGORIES = [
  { name: "Work", color: "bg-blue-200 text-blue-800" },
  { name: "Personal", color: "bg-green-200 text-green-800" },
  { name: "Other", color: "bg-gray-200 text-gray-800" },
];

const PRIORITY_COLORS = {
  low: "border-green-400",
  medium: "border-yellow-400",
  high: "border-red-400",
};

const AddTaskForm = ({ onAdd, isPro, onShowPro }) => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [recurring, setRecurring] = useState("none");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name);
  const [subtasks, setSubtasks] = useState([{ text: "", completed: false }]);

  const inputRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    // Pro feature check
    if (!isPro && (priority !== "medium" || recurring !== "none" || date || time || subtasks.length > 1)) {
      return onShowPro();
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      category,
      priority: isPro ? priority : "",
      recurring: isPro ? recurring : "",
      date: isPro ? date : "",
      time: isPro ? time : "",
      subtasks: isPro
        ? subtasks.filter((s) => s.text.trim() !== "")
        : [],
      completed: false,
    };

    onAdd(newTask);

    // Reset form
    setTaskText("");
    setPriority("medium");
    setRecurring("none");
    setDate("");
    setTime("");
    setCategory(DEFAULT_CATEGORIES[0].name);
    setSubtasks([{ text: "", completed: false }]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].text = value;
    setSubtasks(updated);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { text: "", completed: false }]);
    setTimeout(() => inputRefs.current[subtasks.length]?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
    if (e.key === "Enter" && e.shiftKey && isPro) addSubtask();
  };

  const categoryObj = DEFAULT_CATEGORIES.find((c) => c.name === category);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-3 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border-2 ${
        isPro ? PRIORITY_COLORS[priority] : "border-gray-300 dark:border-gray-600"
      } transition`}
    >
      {/* Task Input */}
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter task..."
        className="border px-3 py-2 rounded-md w-full dark:bg-gray-700 dark:text-white focus:outline-blue-400 transition"
      />

      {/* Category */}
      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`border px-2 py-1 rounded dark:bg-gray-700 dark:text-white ${categoryObj.color}`}
        >
          {DEFAULT_CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {!isPro && <span className="text-xs text-yellow-600">Pro users can add custom categories</span>}
      </div>

      {/* Pro-only Fields */}
      {isPro ? (
        <>
          <div className="flex gap-2 flex-wrap">
            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Recurring */}
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* Date & Time */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Subtasks */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-gray-700 dark:text-gray-200 font-medium">Subtasks</label>
            {subtasks.map((sub, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                value={sub.text}
                onChange={(e) => handleSubtaskChange(i, e.target.value)}
                placeholder={`Subtask ${i + 1}`}
                className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
              />
            ))}
            <button
              type="button"
              onClick={addSubtask}
              className="self-start px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
            >
              + Add Subtask
            </button>
          </div>
        </>
      ) : (
        <div className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm text-center">
          Priority, Recurring, Date, Time & Subtasks are Pro features
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mt-2"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
