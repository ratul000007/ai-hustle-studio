"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const DEFAULT_CATEGORIES = [
  { name: "Work", color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200", emoji: "💼" },
  { name: "Personal", color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200", emoji: "🏠" },
  { name: "Other", color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200", emoji: "📝" },
];

const AddTaskForm = ({ onAdd, isPro, onShowPro }) => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [recurring, setRecurring] = useState("none");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name);
  const [subtasks, setSubtasks] = useState([{ text: "", completed: false }]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [reminder, setReminder] = useState(false);
  const inputRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    if (!isPro && (priority !== "medium" || recurring !== "none" || date || time || subtasks.length > 1 || tags.length || notes || estimatedMinutes || reminder)) {
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
      subtasks: isPro ? subtasks.filter(s => s.text.trim()) : [],
      tags: isPro ? tags : [],
      notes: isPro ? notes : "",
      estimatedMinutes: isPro ? estimatedMinutes : "",
      reminder: isPro ? reminder : false,
      completed: false,
    };

    onAdd(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTaskText("");
    setPriority("medium");
    setRecurring("none");
    setDate("");
    setTime("");
    setCategory(DEFAULT_CATEGORIES[0].name);
    setSubtasks([{ text: "", completed: false }]);
    setTags([]);
    setTagInput("");
    setNotes("");
    setEstimatedMinutes(30);
    setReminder(false);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { text: "", completed: false }]);
    setTimeout(() => inputRefs.current[subtasks.length]?.focus(), 50);
  };

  const removeSubtask = (index) => setSubtasks(subtasks.filter((_, i) => i !== index));
  const handleSubtaskChange = (i, val) => {
    const updated = [...subtasks];
    updated[i].text = val;
    setSubtasks(updated);
  };

  const moveSubtask = (i, dir) => {
    const updated = [...subtasks];
    const targetIndex = i + dir;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    [updated[i], updated[targetIndex]] = [updated[targetIndex], updated[i]];
    setSubtasks(updated);
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const categoryObj = DEFAULT_CATEGORIES.find(c => c.name === category);
  const badgeBase = "px-3 py-1 min-w-[60px] text-center rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 transition text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 transition">

      {/* Task Input */}
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter task..."
        className="border px-4 py-2 rounded-lg w-full dark:bg-gray-700 dark:text-gray-200 focus:outline-gray-400 transition"
      />

      {/* Notes */}
      {isPro && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes (optional)"
          className="border px-4 py-2 rounded-lg w-full dark:bg-gray-700 dark:text-gray-200 transition"
        />
      )}

      {/* Category */}
      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={`border px-3 py-1 rounded-lg dark:bg-gray-700 dark:text-gray-200 ${categoryObj.color}`}
        >
          {DEFAULT_CATEGORIES.map(c => (
            <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
          ))}
        </select>
        {!isPro && <span className="text-xs text-gray-500">Pro: Custom categories & emojis</span>}
      </div>

      {/* Pro Features */}
      {isPro && (
        <>
          <div className="flex flex-wrap gap-3 items-center">

            {/* Priority */}
            <div className="flex gap-1 items-center flex-wrap">
              <label className="text-sm dark:text-gray-200">Priority:</label>
              {["low", "medium", "high"].map(p => (
                <span
                  key={p}
                  className={`${badgeBase} ${priority===p ? "bg-indigo-500 text-white dark:bg-indigo-600" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                  onClick={() => setPriority(p)}
                >
                  {p.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Recurring */}
            <div className="flex gap-1 items-center flex-wrap">
              <label className="text-sm dark:text-gray-200">Recurring:</label>
              {["none", "daily", "weekly", "monthly"].map(r => (
                <span
                  key={r}
                  className={`${badgeBase} ${recurring===r ? "bg-green-500 text-white dark:bg-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                  onClick={() => setRecurring(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              ))}
            </div>

            {/* Date & Time */}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-3 py-1 rounded-lg dark:bg-gray-700 dark:text-gray-200 flex-shrink-0"/>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border px-3 py-1 rounded-lg dark:bg-gray-700 dark:text-gray-200 flex-shrink-0"/>

            {/* Estimated Minutes */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-sm dark:text-gray-200">Est. min:</label>
              <input type="range" min="5" max="180" value={estimatedMinutes} onChange={e => setEstimatedMinutes(e.target.value)} className="accent-indigo-500 w-32"/>
              <span className="w-10 text-sm dark:text-gray-200">{estimatedMinutes}m</span>
            </div>

            {/* Reminder */}
            <label className="flex items-center gap-1 text-sm flex-shrink-0 dark:text-gray-200">
              <input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} className="w-4 h-4 accent-green-500"/> Reminder
            </label>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                {tag} <button type="button" onClick={() => removeTag(i)}>x</button>
              </span>
            ))}
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey} placeholder="Add tag + Enter" className="border px-2 py-1 rounded-lg dark:bg-gray-700 dark:text-gray-200"/>
          </div>

          {/* Subtasks */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-gray-700 dark:text-gray-200 font-medium">Subtasks</label>
            {subtasks.map((sub, i) => (
              <div key={i} className="flex gap-2 items-center flex-wrap">
                <input ref={el => (inputRefs.current[i] = el)} type="text" value={sub.text} onChange={e => handleSubtaskChange(i, e.target.value)} placeholder={`Subtask ${i+1}`} className="border px-2 py-1 rounded-lg dark:bg-gray-700 dark:text-gray-200 flex-1"/>
                {i > 0 && <>
                  <button type="button" onClick={() => moveSubtask(i, -1)} className="text-gray-500 hover:text-gray-700">↑</button>
                  <button type="button" onClick={() => moveSubtask(i, 1)} className="text-gray-500 hover:text-gray-700">↓</button>
                  <button type="button" onClick={() => removeSubtask(i)} className="text-red-500 hover:text-red-700">x</button>
                </>}
              </div>
            ))}
            <button type="button" onClick={addSubtask} className="self-start px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">+ Add Subtask</button>
          </div>
        </>
      )}

      {!isPro && (
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm text-center">
          Priority, Recurring, Date, Time, Subtasks, Tags, Notes & Reminder are Pro features
        </div>
      )}

      <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg mt-3 bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-500 transition">
        Add Task
      </motion.button>
    </form>
  );
};

export default AddTaskForm;
