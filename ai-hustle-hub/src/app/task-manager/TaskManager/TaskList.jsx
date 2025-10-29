"use client";

import { useState, useEffect } from "react";
import ProgressBar from "@/app/task-manager/TaskManager/ProgressBar";

const TaskList = ({ tasks, setTasks, isPro, filter, sortBy }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  // Auto-generate recurring tasks for Pro users
  useEffect(() => {
    if (!isPro) return;
    const today = new Date().toISOString().split("T")[0];
    const newTasks = [];
    tasks.forEach((task) => {
      if (!task.completed && task.recurring === "daily" && task.date !== today) {
        newTasks.push({ ...task, id: Date.now() + Math.random(), date: today });
      }
    });
    if (newTasks.length) setTasks([...tasks, ...newTasks]);
  }, [tasks, isPro]);

  const handleDelete = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const handleToggle = (task, subtaskIndex = null) => {
    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        if (subtaskIndex !== null) {
          const newSubtasks = [...(t.subtasks || [])];
          newSubtasks[subtaskIndex].completed = !newSubtasks[subtaskIndex].completed;
          return { ...t, subtasks: newSubtasks };
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(updated);

    if (isPro && !task.completed && "Notification" in window) {
      new Notification("Task Completed!", { body: task.text });
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSave = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditingId(null);
  };

  // Filter tasks
  let displayedTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  // Sorting
  if (sortBy === "priority" && isPro) {
    const priorityOrder = { high: 0, medium: 1, low: 2, "": 3 };
    displayedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortBy === "date" && isPro) {
    displayedTasks.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-3">
      {isPro && (
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="self-end px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </button>
      )}

      <ul className="space-y-4">
        {displayedTasks.map((task) => {
          if (!showCompleted && task.completed && isPro) return null;
          const isOverdue = task.date && task.date < today && !task.completed;

          const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
          const totalSubtasks = task.subtasks?.length || 0;

          return (
            <li
              key={task.id}
              className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex flex-col md:flex-row md:justify-between transition transform hover:scale-[1.01] border-2 ${
                isOverdue ? "border-red-400" : "border-transparent"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 w-full">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  {editingId === task.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white w-full"
                    />
                  ) : (
                    <span
                      className={`font-medium text-sm md:text-base ${
                        task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap mt-1 md:mt-0">
                  {task.category && <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">{task.category}</span>}
                  {task.priority && <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded">{task.priority}</span>}
                  {task.recurring && <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded">{task.recurring}</span>}
                  {task.date && (
                    <span className={`text-xs px-2 py-0.5 rounded ${isOverdue ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"}`}>
                      {task.date}
                    </span>
                  )}
                  {task.time && <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{task.time}</span>}
                </div>

                {/* Subtasks */}
                {isPro && task.subtasks && task.subtasks.length > 0 && (
                  <div className="w-full mt-2 md:mt-0 flex flex-col gap-1">
                    <ul className="pl-4 flex flex-col gap-1">
                      {task.subtasks.map((sub, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.completed || false}
                            onChange={() => handleToggle(task, i)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className={`text-sm ${sub.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}`}>
                            {sub.text || "Subtask"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1">
                      <ProgressBar completed={completedSubtasks} total={totalSubtasks} />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 md:mt-0">
                {editingId === task.id ? (
                  <button
                    onClick={() => handleSave(task.id)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
