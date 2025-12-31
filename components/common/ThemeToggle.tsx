// components/DarkModeToggle.js
"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render nothing on the server and until the theme is mounted
    return null
  }


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button className='p-2 hover:bg-accent rounded-sm flex justify-center items-center' onClick={toggleTheme} style={{ fontSize: '24px' }}>
        <Sun className="h-[1.2rem] w-[1.2rem]  transition-all hidden dark:block" />
        <Moon className="h-[1.2rem] w-[1.2rem]   transition-all  dark:hidden" />
        <span className="sr-only">Toggle theme</span>
    </button>
  );
}