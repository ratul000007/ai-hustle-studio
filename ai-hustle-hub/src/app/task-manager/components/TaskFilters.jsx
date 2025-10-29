"use client";

const TaskFilters = ({ filter, setFilter }) => (
  <div className="flex justify-center gap-2">
    <button className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`} onClick={() => setFilter("all")}>All</button>
    <button className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`} onClick={() => setFilter("completed")}>Completed</button>
    <button className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`} onClick={() => setFilter("pending")}>Pending</button>
  </div>
);

export default TaskFilters;
