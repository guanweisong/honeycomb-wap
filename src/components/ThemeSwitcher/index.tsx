'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Theme } from '@/src/types/Theme';

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
    setTheme(checked ? Theme.Dark : Theme.Light);
  };

  return (
    <DarkModeSwitch
      size={20}
      checked={theme === Theme.Dark}
      onChange={toggleDarkMode}
      sunColor="#333"
      moonColor="#ccc"
    />
  );
};
