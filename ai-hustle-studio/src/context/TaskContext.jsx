"use client";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    // example task
    { id: 1, text: "Finish project plan", date: new Date().toDateString(), completed: false },
  ]);

  const addTask = (task) => setTasks([...tasks, { id: Date.now(), ...task }]);
  const toggleComplete = (id) =>
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleComplete, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
