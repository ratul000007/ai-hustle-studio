"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Persist tasks to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add task
  const addTask = (task) => {
    const newTask = {
      id: uuidv4(),
      text: task.text || "",
      completed: task.completed || false,
      category: task.category || "Other",
      priority: task.priority || "medium",
      recurring: task.recurring || "none",
      date: task.date || "",
      time: task.time || "",
      subtasks: task.subtasks || [],
      tags: task.tags || [],
      notes: task.notes || "",
      estimatedMinutes: task.estimatedMinutes || 30,
      reminder: task.reminder || false,
      reminderTime: task.reminderTime || 10,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  // Update task
  const updateTask = (id, updatedFields) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  // Toggle complete
  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete task
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  // Auto-generate recurring tasks
  const generateRecurringTasks = () => {
    const today = new Date().toDateString();
    const newTasks = tasks
      .filter(t => !t.completed && t.recurring === "daily" && t.date !== today)
      .map(t => ({ ...t, id: uuidv4(), date: today }));
    if (newTasks.length) setTasks([...tasks, ...newTasks]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleComplete,
        deleteTask,
        generateRecurringTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
