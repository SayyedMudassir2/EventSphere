"use client";
import React, { useState, useEffect } from "react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has visited before by looking for our key in localStorage
    const hasVisited = localStorage.getItem("hasVisitedEventSphere");

    if (!hasVisited) {
      setIsOpen(true);
      // Set the key so it doesn't trigger again on refresh
      localStorage.setItem("hasVisitedEventSphere", "true");
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#111116] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Welcome to My Project!</h2>
        <p className="text-gray-400 mb-6">
          Hi, I'm <span className="text-white font-semibold">Sayyed Misna</span>
          . This project is a showcase of my work. I am currently studying at
          <span className="text-blue-400 font-semibold">
            {" "}
            Ismail Yusuf College
          </span>
          .
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all font-medium"
        >
          Explore the project
        </button>
      </div>
    </div>
  );
}
