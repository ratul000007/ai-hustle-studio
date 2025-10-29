"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TaskDetailModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [editText, setEditText] = useState(task.text);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const handleSubtaskToggle = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
    onUpdate && onUpdate({ ...task, subtasks: updated });
  };

  const handleSave = () => {
    const updatedTask = { ...task, text: editText, subtasks };
    onUpdate && onUpdate(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete(task.id);
    onClose();
  };

  const addSubtask = () => {
    const updated = [...subtasks, { text: "", completed: false }];
    setSubtasks(updated);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].text = value;
    setSubtasks(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-md shadow-xl relative"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{task.text}</h2>

        {/* Editable text */}
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white"
        />

        {/* Task details */}
        <div className="flex flex-wrap gap-2 mb-4">
          {task.category && <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">{task.category}</span>}
          {task.priority && <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded">{task.priority}</span>}
          {task.recurring && <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded">{task.recurring}</span>}
          {task.date && <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded">{task.date}</span>}
          {task.time && <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded">{task.time}</span>}
        </div>

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Subtasks</h3>
            <ul className="flex flex-col gap-2">
              {subtasks.map((sub, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleSubtaskToggle(i)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={sub.text}
                    onChange={(e) => handleSubtaskChange(i, e.target.value)}
                    className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-white"
                  />
                </li>
              ))}
            </ul>
            <button
              onClick={addSubtask}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
            >
              + Add Subtask
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Save
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Delete
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
