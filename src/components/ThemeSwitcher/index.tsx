'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Theme } from '@/src/types/Theme';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    let themeColor = 'white';
    switch (resolvedTheme) {
      case Theme.Dark:
        themeColor = '#111827';
        break;
      case Theme.Light:
        themeColor = 'white';
        break;
    }
    const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
    if (themeMetas?.length) {
      document.querySelectorAll('meta[name="theme-color"]')?.forEach((item) => {
        item.setAttribute('content', themeColor);
      });
    } else {
      const headElement = document.head || document.getElementsByTagName('head')[0];
      const themeColorMetaTag = document.createElement('meta');
      themeColorMetaTag.name = 'theme-color';
      themeColorMetaTag.content = themeColor; // 修改颜色值
      headElement.appendChild(themeColorMetaTag);
    }
  }, [resolvedTheme]);

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
      checked={resolvedTheme === Theme.Dark}
      onChange={toggleDarkMode}
      sunColor="#333"
      moonColor="#ccc"
    />
  );
};
