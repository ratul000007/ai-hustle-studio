"use client";

const ProgressBar = ({ completed, total }) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full h-2 bg-gray-300 rounded overflow-hidden dark:bg-gray-700">
      <div
        className="h-2 bg-green-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
