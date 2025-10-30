"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";

// Google Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Theme Toggle Button
function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// Responsive Navigation
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/task-manager" className="hover:text-blue-500">Tasks</Link>
        <Link href="/task-manager/focus" className="hover:text-blue-500">Focus</Link>
        <Link href="/task-manager/settings" className="hover:text-blue-500">Settings</Link>
        <ThemeToggleButton />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggleButton />
        <button onClick={() => setOpen(!open)} className="p-2 rounded border hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <Menu size={18} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded shadow-lg z-50">
            <Link href="/task-manager" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Tasks</Link>
            <Link href="/task-manager/focus" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Focus</Link>
            <Link href="/task-manager/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Settings</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <ThemeProvider>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
            <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
              <Link href="/task-manager" className="font-bold text-xl hover:text-blue-500">
                🧠 AI Hustle Hub
              </Link>
              <Navbar />
            </div>
          </header>

          {/* Page Content */}
          <main className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh]">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} AI Hustle Hub — Manage smarter, not harder 💪</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
