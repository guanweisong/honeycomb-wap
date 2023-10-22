'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DarkModeSwitch
      size={20}
      checked={theme === 'dark'}
      onChange={toggleDarkMode}
      sunColor="#333"
      moonColor="#ccc"
    />
  );
};
