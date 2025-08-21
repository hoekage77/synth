'use client';

import Image from 'next/image';
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
    <Image
      src={isDarkMode ? "/xera-logo-white.svg" : "/xera-logo.svg"}
      alt="Xera"
      width={size * 3.6}
      height={size * 3.6}
      className="transition-all duration-300"
    />
  );
}
