'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface XeraLogoProps {
  size?: number;
}

export function XeraLogo({ size = 32 }: XeraLogoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  );

  return (
    <div 
      className="flex items-center justify-center transition-all duration-300"
      style={{ width: size * 3.6, height: size * 3.6 }}
    >
      <span 
        className={`font-bold tracking-tight transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
        style={{ fontSize: size * 0.8 }}
      >
        XERA
      </span>
    </div>
  );
}
