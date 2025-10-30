"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskDetailModal from "./TaskDetailModal";
import ProgressBar from "./ProgressBar";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const TaskList = ({ tasks, setTasks, isPro }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [modalTask, setModalTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  // Auto-generate recurring tasks
  useEffect(() => {
    if (!isPro) return;
    const newTasks = tasks
      .filter(t => !t.completed && t.recurring === "daily" && t.date !== today)
      .map(t => ({ ...t, id: Date.now() + Math.random(), date: today }));
    if (newTasks.length) setTasks([...tasks, ...newTasks]);
  }, [tasks, isPro]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const displayedTasks = useMemo(() => {
    let filtered = tasks.filter(t =>
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filter === "all" || (filter === "completed" && t.completed) || (filter === "pending" && !t.completed))
    );

    if (!showCompleted) filtered = filtered.filter(t => !t.completed);
    if (!showOverdue) filtered = filtered.filter(t => !t.date || t.date >= today);

    if (sortBy === "priority" && isPro) {
      const priorityOrder = { high: 0, medium: 1, low: 2, "": 3 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "date" && isPro) {
      filtered.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    } else if (sortBy === "alphabet") {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    }

    return filtered;
  }, [tasks, searchQuery, filter, sortBy, showCompleted, showOverdue, isPro, today]);

  const SortableTask = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const isOverdue = task.date && task.date < today && !task.completed;

    const handleToggleComplete = (e) => {
      e.stopPropagation();
      const updated = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
      setTasks(updated);
      if (isPro && !task.completed && "Notification" in window) {
        new Notification("Task Completed!", { body: task.text });
      }
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      setTasks(tasks.filter(t => t.id !== task.id));
    };

    const handleEdit = (e) => {
      e.stopPropagation();
      setEditingId(task.id);
      setEditText(task.text);
    };

    const handleSaveEdit = (e) => {
      e.stopPropagation();
      setTasks(tasks.map(t => t.id === task.id ? { ...t, text: editText } : t));
      setEditingId(null);
    };

    return (
      <AnimatePresence>
        <motion.li
          ref={setNodeRef}
          style={style}
          {...attributes}
          className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex flex-col md:flex-row md:justify-between border-2 items-start gap-2 hover:scale-[1.02] transition cursor-pointer ${isOverdue ? "border-red-400" : "border-transparent"}`}
          onClick={() => setModalTask(task)}
        >
          <div className="flex items-center gap-2 w-full">
            {isPro && <GripVertical className="cursor-grab text-gray-400" {...listeners} />}
            <input type="checkbox" checked={task.completed} onChange={handleToggleComplete} className="w-5 h-5"/>
            {editingId === task.id ? (
              <input value={editText} onChange={(e) => setEditText(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white w-full"/>
            ) : (
              <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                {task.text}
              </span>
            )}
          </div>

          <div className="flex gap-1 mt-2 md:mt-0 flex-wrap items-center">
            {task.category && <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">{task.category}</span>}
            {task.priority && <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded">{task.priority}</span>}
            {task.recurring && <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded">{task.recurring}</span>}
            {task.date && <span className={`text-xs px-2 py-0.5 rounded ${isOverdue ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"}`}>{task.date}</span>}
            {task.tags?.length > 0 && <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded">{task.tags.join(", ")}</span>}
          </div>

          {task.subtasks?.length > 0 && (
            <div className="w-full mt-2">
              <ProgressBar completed={completedSubtasks} total={totalSubtasks} tooltip />
            </div>
          )}

          <div className="flex gap-1 mt-2 md:mt-0">
            {editingId === task.id ? (
              <button onClick={handleSaveEdit} className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition">Save</button>
            ) : (
              <>
                <button onClick={handleEdit} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Edit</button>
                <button onClick={handleDelete} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
              </>
            )}
          </div>
        </motion.li>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white flex-1"/>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white">
          <option value="date">Date</option>
          <option value="priority">Priority</option>
          <option value="alphabet">A → Z</option>
        </select>
        {isPro && (
          <>
            <button onClick={() => setShowCompleted(!showCompleted)} className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition text-sm">
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </button>
            <button onClick={() => setShowOverdue(!showOverdue)} className="px-2 py-1 bg-red-300 dark:bg-red-700 rounded hover:bg-red-400 dark:hover:bg-red-600 transition text-sm">
              {showOverdue ? "Hide Overdue" : "Show Overdue"}
            </button>
          </>
        )}
      </div>

      {isPro ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-4">{displayedTasks.map(task => <SortableTask key={task.id} task={task} />)}</ul>
          </SortableContext>
        </DndContext>
      ) : (
        <ul className="space-y-4">{displayedTasks.map(task => <SortableTask key={task.id} task={task} />)}</ul>
      )}

      {modalTask && (
        <TaskDetailModal
          task={modalTask}
          onClose={() => setModalTask(null)}
          onUpdate={(updated) => setTasks(tasks.map(t => t.id === updated.id ? updated : t))}
          onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
          isPro={isPro}
        />
      )}
    </div>
  );
};

export default TaskList;
