"use client";

import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-6">
      <AddTaskForm onAdd={handleAddTask} isPro={true} onShowPro={() => alert("Pro feature")} />
      <TaskList tasks={tasks} onDelete={handleDeleteTask} onToggleComplete={handleToggleComplete} />
    </div>
  );
};

export default TaskManagerPage;
