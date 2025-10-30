"use client";
import { useState, useEffect, createContext, useContext } from "react";

// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // "light", "dark", or custom

  // Load saved theme or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Smooth transition for theme changes
    root.style.transition = "background-color 0.3s, color 0.3s";

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle dark/light
  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  // Set specific theme (for multi-theme support)
  const applyTheme = (newTheme) => setTheme(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme anywhere
export const useTheme = () => useContext(ThemeContext);
