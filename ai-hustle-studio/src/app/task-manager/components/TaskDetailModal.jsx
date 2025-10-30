"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TaskDetailModal = ({ task, onClose, onUpdate, onDelete, isPro, existingTags = [] }) => {
  const [editText, setEditText] = useState(task.text);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [notes, setNotes] = useState(task.notes || "");
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [category, setCategory] = useState(task.category || "Other");
  const [recurring, setRecurring] = useState(task.recurring || "none");
  const [date, setDate] = useState(task.date || "");
  const [time, setTime] = useState(task.time || "");
  const inputRefs = useRef([]);

  useEffect(() => {
    setEditText(task.text);
    setSubtasks(task.subtasks || []);
    setNotes(task.notes || "");
    setTags(task.tags || []);
  }, [task]);

  const handleSubtaskToggle = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
    onUpdate && onUpdate({ ...task, subtasks: updated });
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

  const removeSubtask = (index) => {
    const updated = subtasks.filter((_, i) => i !== index);
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

  const handleSave = () => {
    const updatedTask = {
      ...task,
      text: editText,
      subtasks,
      notes,
      tags,
      priority,
      category,
      recurring,
      date,
      time,
    };
    onUpdate && onUpdate(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete(task.id);
    onClose();
  };

  const progress = subtasks.length ? (subtasks.filter(s => s.completed).length / subtasks.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl relative overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{task.text}</h2>

        {/* Editable Text */}
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
        />

        {/* Notes */}
        {isPro && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes / description"
            className="border px-3 py-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
          />
        )}

        {/* Tags */}
        {isPro && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span key={i} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                {tag} <button type="button" onClick={() => removeTag(i)}>x</button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="Add tag + Enter"
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        {/* Priority, Category, Recurring, Date & Time */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["priority", "category", "recurring"].map((key) => (
            <select
              key={key}
              value={key === "priority" ? priority : key === "category" ? category : recurring}
              onChange={(e) => {
                if (key === "priority") setPriority(e.target.value);
                if (key === "category") setCategory(e.target.value);
                if (key === "recurring") setRecurring(e.target.value);
              }}
              className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            >
              {key === "priority" && ["low","medium","high"].map(p => <option key={p} value={p}>{p}</option>)}
              {key === "category" && ["Work","Personal","Other"].map(c => <option key={c} value={c}>{c}</option>)}
              {key === "recurring" && ["none","daily","weekly","monthly"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          ))}
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"/>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"/>
        </div>

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Subtasks ({subtasks.filter(s=>s.completed).length}/{subtasks.length})</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mb-2">
              <div className="bg-indigo-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
            </div>
            <ul className="flex flex-col gap-2">
              {subtasks.map((sub, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={sub.completed} onChange={() => handleSubtaskToggle(i)} className="w-4 h-4 cursor-pointer"/>
                  <input
                    ref={el => (inputRefs.current[i] = el)}
                    type="text"
                    value={sub.text}
                    onChange={(e) => handleSubtaskChange(i, e.target.value)}
                    className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-white"
                  />
                  <button onClick={() => removeSubtask(i)} className="text-red-500 hover:text-red-700">x</button>
                </li>
              ))}
            </ul>
            <button onClick={addSubtask} className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm">+ Add Subtask</button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-4 flex-wrap gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Save</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
