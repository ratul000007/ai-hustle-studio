"use client";

import { useEffect, useState } from "react";

const StreakTracker = ({ tasks, isPro, onShowPro }) => {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  // Helper: format date as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    if (!isPro) return;

    // Sort tasks by date
    const completedDates = tasks
      .filter(t => t.completed && t.date)
      .map(t => t.date)
      .sort((a, b) => new Date(b) - new Date(a));

    if (!completedDates.length) {
      setStreak(0);
      return;
    }

    let currentStreak = 1;
    for (let i = 0; i < completedDates.length - 1; i++) {
      const date = new Date(completedDates[i]);
      const prevDate = new Date(completedDates[i + 1]);
      const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) currentStreak++;
      else break;
    }

    setStreak(currentStreak);

    if (currentStreak > bestStreak) setBestStreak(currentStreak);

    setLastCompletedDate(completedDates[0]);
  }, [tasks, isPro, bestStreak]);

  // Optional: visual progress for streak (e.g., progress toward 7-day streak)
  const streakProgress = Math.min((streak / 7) * 100, 100);

  if (!isPro) {
    return (
      <div
        className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        onClick={onShowPro}
      >
        🔒 Streak Tracker is a Pro feature. Upgrade to track your streaks!
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold mb-2">🔥 Current Streak</h3>
      <p className="text-3xl font-bold mb-2">{streak} day{streak !== 1 ? "s" : ""}</p>

      {/* Streak progress bar */}
      <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full mb-2">
        <div
          className="h-2 bg-green-500 rounded-full transition-all"
          style={{ width: `${streakProgress}%` }}
        />
      </div>

      {lastCompletedDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Last completed: {lastCompletedDate}
        </p>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Best streak: {bestStreak} day{bestStreak !== 1 ? "s" : ""}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Keep completing tasks daily to maintain your streak!
      </p>
    </div>
  );
};

export default StreakTracker;
