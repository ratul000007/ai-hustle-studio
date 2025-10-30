"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import AddTaskForm from "./AddTaskForm";
import TaskDetailModal from "./TaskDetailModal";
import ProModal from "./ProModal";
import { useTasks } from "@/context/TaskContext";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ isPro }) => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [showProModal, setShowProModal] = useState(false);
  const [dayTaskListOpen, setDayTaskListOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();

  // Build calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= numDays; d++) calendarDays.push(new Date(year, month, d));

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const jumpToToday = () => setCurrentDate(new Date());

  // Tasks for a specific day
  const tasksForDay = (date) =>
    tasks.filter((t) => t.date && new Date(t.date).toDateString() === date?.toDateString());

  // Generate recurring daily tasks (Pro)
  useEffect(() => {
    if (!isPro) return;
    const todayStr = new Date().toDateString();
    const newTasks = tasks
      .filter(t => !t.completed && t.recurring === "daily" && t.date !== todayStr)
      .map(t => ({ ...t, id: uuidv4(), date: todayStr }));
    newTasks.forEach(addTask);
  }, [tasks, isPro, addTask]);

  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDate(date);

    const dayTasks = tasksForDay(date);
    if (!isPro && dayTasks.length === 0) return setShowProModal(true);

    setDayTaskListOpen(true); // Show mini-task list for that day
  };

  const handleTaskClick = (task) => {
    setModalTask(task);
    setDayTaskListOpen(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={prevMonth} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm">Prev</button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
        <button onClick={nextMonth} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm">Next</button>
        <button onClick={jumpToToday} className="ml-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm">Today</button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, idx) => {
          const dayTasks = tasksForDay(date);
          const isToday = date?.toDateString() === new Date().toDateString();
          const isOverdue = dayTasks.some(t => t.date < new Date().toDateString() && !t.completed);

          return (
            <div
              key={uuidv4()}
              onClick={() => handleDayClick(date)}
              className={`h-16 p-1 border rounded flex flex-col text-[10px] overflow-hidden transition cursor-pointer
                ${isToday ? "bg-blue-100 dark:bg-blue-800 border-blue-400 dark:border-blue-600"
                          : isOverdue ? "bg-red-100 dark:bg-red-800 border-red-400 dark:border-red-600"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"}
                hover:shadow-md`}
              title={dayTasks.map(t => t.text).join(", ")}
            >
              {date && <div className="font-medium text-sm mb-0.5 text-gray-800 dark:text-gray-100">{date.getDate()}</div>}

              {/* Task dots */}
              <div className="flex flex-wrap gap-0.5 mt-auto">
                {dayTasks.map(t => (
                  <span
                    key={t.id}
                    className={`w-2 h-2 rounded-full
                      ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                    onClick={(e) => { e.stopPropagation(); handleTaskClick(t); }}
                  ></span>
                ))}
              </div>

              {/* Recurring indicator */}
              {dayTasks.some(t => t.recurring) && <div className="text-[8px] mt-0.5 text-blue-500 dark:text-blue-300">⟳</div>}
            </div>
          );
        })}
      </div>

      {/* Mini Task List for selected day */}
      {dayTaskListOpen && selectedDate && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Tasks for {selectedDate.toDateString()}</h3>
          {tasksForDay(selectedDate).map(t => (
            <div key={t.id} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => handleTaskClick(t)}
            >
              {t.text} {t.completed && <span className="text-green-600">(Done)</span>}
            </div>
          ))}
          <button
            onClick={() => setShowTaskModal(true)}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            + Add Task
          </button>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && selectedDate && (
        <AddTaskForm
          prefillDate={selectedDate.toISOString().split("T")[0]}
          onAdd={(task) => { addTask(task); setShowTaskModal(false); }}
          isPro={isPro}
          onShowPro={() => setShowProModal(true)}
        />
      )}

      {/* Task Detail Modal */}
      {modalTask && (
        <TaskDetailModal
          task={modalTask}
          onClose={() => setModalTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          isPro={isPro}
        />
      )}

      {/* Pro Modal */}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
};

export default CalendarView;
