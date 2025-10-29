"use client";
import Link from "next/link"; // <--- ADD THIS

const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-600">AI Hustle Studio</h1>
      <nav>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li><a href="#home" className="hover:text-blue-600">Home</a></li>
          <li><a href="#apps" className="hover:text-blue-600">Apps</a></li>
          <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
          <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          {/* Add this for your Task Manager page */}
          <li>
            <Link href="/task-manager" className="hover:text-blue-600">
              Task Manager
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
