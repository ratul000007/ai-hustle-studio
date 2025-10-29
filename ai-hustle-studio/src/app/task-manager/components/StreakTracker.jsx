"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StreakTracker = ({ tasks, isPro, onShowPro }) => {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    if (!isPro) return;

    const completedDates = tasks
      .filter((t) => t.completed && t.date)
      .map((t) => t.date)
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

  // Progress calculations
  const streakProgress7 = Math.min((streak / 7) * 100, 100);
  const streakProgress30 = Math.min((streak / 30) * 100, 100);

  const getProgressColor = (value) => {
    if (value < 50) return "bg-red-500";
    if (value < 80) return "bg-yellow-400";
    return "bg-green-500";
  };

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
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow text-center transition-colors">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">🔥 Current Streak</h3>
      <p className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        {streak} day{streak !== 1 ? "s" : ""}
      </p>

      {/* Streak progress bar 7-day */}
      <div className="mb-2 text-left">
        <span className="text-xs text-gray-500 dark:text-gray-400">7-day streak goal</span>
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
          <motion.div
            className={`h-3 rounded-full ${getProgressColor(streakProgress7)}`}
            style={{ width: `${streakProgress7}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${streakProgress7}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Streak progress bar 30-day */}
      <div className="mb-2 text-left">
        <span className="text-xs text-gray-500 dark:text-gray-400">30-day streak goal</span>
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
          <motion.div
            className={`h-3 rounded-full ${getProgressColor(streakProgress30)}`}
            style={{ width: `${streakProgress30}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${streakProgress30}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {lastCompletedDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Last completed: {lastCompletedDate}
        </p>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Best streak: {bestStreak} day{bestStreak !== 1 ? "s" : ""}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        Keep completing tasks daily to maintain your streak!
      </p>

      {streak >= 7 && <p className="text-green-500 font-bold animate-pulse">🎉 7-Day Streak Achieved!</p>}
      {streak >= 30 && <p className="text-green-500 font-bold animate-pulse">🏆 30-Day Streak Achieved!</p>}
    </div>
  );
};

export default StreakTracker;
