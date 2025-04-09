
import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { SunIcon, MoonIcon } from "lucide-react";

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <Toggle
      pressed={theme === 'light'}
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      className="h-10 px-3"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4 mr-2" />
      ) : (
        <MoonIcon className="h-4 w-4 mr-2" />
      )}
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Toggle>
  );
};

export default ThemeToggle;
