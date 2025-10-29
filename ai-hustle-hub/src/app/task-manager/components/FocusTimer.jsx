"use client";

import { useState, useEffect, useRef } from "react";

const DEFAULT_SOUNDS = [
  { name: "Bell", file: "/sounds/bell.mp3" },
  { name: "Chime", file: "/sounds/chime.mp3" },
  { name: "Alert", file: "/sounds/alert.mp3" },
];

const DEFAULT_PRESETS = {
  "25/5": { work: 25, break: 5 },
  "50/10": { work: 50, break: 10 },
};

const FocusTimer = ({ isPro, onShowPro }) => {
  const [pomodoroType, setPomodoroType] = useState("25/5");
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_PRESETS[pomodoroType].work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sound, setSound] = useState(DEFAULT_SOUNDS[0].file);
  const [volume, setVolume] = useState(0.5);
  const [autoNext, setAutoNext] = useState(false);

  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);

  const timerRef = useRef(null);

  // Update timer when pomodoro type or custom times change
  useEffect(() => {
    if (pomodoroType === "custom") {
      setTimeLeft((isWork ? customWork : customBreak) * 60);
    } else {
      setTimeLeft((isWork ? DEFAULT_PRESETS[pomodoroType].work : DEFAULT_PRESETS[pomodoroType].break) * 60);
    }
  }, [pomodoroType, isWork, customWork, customBreak]);

  // Timer interval
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          playSound();
          if (isWork) setCompletedSessions((prev) => prev + 1);

          if (isPro && autoNext) {
            handleAutoNext();
          } else {
            setIsRunning(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, autoNext, isWork, isPro, sound, volume]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === " ") setIsRunning((prev) => !prev);
      if (e.key === "r") handleReset();
      if (e.key === "n" && isPro) handleAutoNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, isPro]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroType === "custom" ? (isWork ? customWork : customBreak) * 60 :
      (isWork ? DEFAULT_PRESETS[pomodoroType].work : DEFAULT_PRESETS[pomodoroType].break) * 60);
  };

  const handleAutoNext = () => {
    setIsWork(!isWork);
    handleReset();
    setIsRunning(true);
    showNotification(isWork ? "Work Completed!" : "Break Completed!");
  };

  const playSound = () => {
    const audio = new Audio(sound);
    audio.volume = volume;
    audio.play();
    showNotification(isWork ? "Work Completed!" : "Break Completed!");
  };

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progressPercent = ((pomodoroType === "custom" ? (isWork ? customWork : customBreak) * 60 : 
    (isWork ? DEFAULT_PRESETS[pomodoroType].work : DEFAULT_PRESETS[pomodoroType].break) * 60) - timeLeft) /
    (pomodoroType === "custom" ? (isWork ? customWork : customBreak) * 60 : 
    (isWork ? DEFAULT_PRESETS[pomodoroType].work : DEFAULT_PRESETS[pomodoroType].break) * 60) * 100;

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">Pomodoro Timer</h2>
      <div className="text-5xl font-mono font-bold mb-4 text-gray-900 dark:text-gray-50">{minutes}:{seconds}</div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded mb-4">
        <div className="h-2 bg-green-500 rounded transition-all" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        <button onClick={startTimer} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Start</button>
        <button onClick={pauseTimer} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Pause</button>
        <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reset</button>
      </div>

      <div className="flex justify-center gap-2 flex-wrap mb-4 items-center">
        <label className="text-gray-700 dark:text-gray-200">Preset:</label>
        <select
          value={pomodoroType}
          onChange={(e) => {
            if (e.target.value === "custom") isPro ? setPomodoroType("custom") : onShowPro();
            else setPomodoroType(e.target.value);
          }}
          className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
        >
          {Object.keys(DEFAULT_PRESETS).map((key) => <option key={key} value={key}>{key}</option>)}
          <option value="custom">Custom (Pro)</option>
        </select>

        {/* Custom times */}
        {pomodoroType === "custom" && isPro && (
          <div className="flex gap-2">
            <input type="number" min="1" value={customWork} onChange={e => setCustomWork(+e.target.value)} className="w-16 p-1 border rounded" /> Work
            <input type="number" min="1" value={customBreak} onChange={e => setCustomBreak(+e.target.value)} className="w-16 p-1 border rounded" /> Break
          </div>
        )}

        <label className="text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Auto Next:
          <input type="checkbox" checked={autoNext} onChange={() => isPro ? setAutoNext(!autoNext) : onShowPro()} className="w-5 h-5"/>
        </label>

        <label className="text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Volume:
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(+e.target.value)} className="w-24"/>
        </label>

        <label className="text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Sound:
          <select value={sound} onChange={(e) => isPro ? setSound(e.target.value) : onShowPro()} className="border rounded px-2 py-1 ml-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50">
            {DEFAULT_SOUNDS.map((s) => <option key={s.name} value={s.file}>{s.name}</option>)}
          </select>
        </label>
      </div>

      <p className="text-gray-700 dark:text-gray-200 mt-2">Completed Sessions: {completedSessions}</p>
      <p className="text-gray-600 dark:text-gray-300">{isWork ? "Work Session" : "Break Session"}</p>
    </div>
  );
};

export default FocusTimer;
