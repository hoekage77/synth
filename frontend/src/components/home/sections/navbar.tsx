'use client';

import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Cpu, Power, Zap } from 'lucide-react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/home';

// Dynamic import for NavMenu to reduce initial bundle size
const NavMenu = dynamic(() => import('@/components/home/nav-menu').then(mod => ({ default: mod.NavMenu })), {
  loading: () => (
    <div className="flex items-center gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 w-16 bg-muted/10 animate-pulse rounded" />
      ))}
    </div>
  ),
  ssr: false
});

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { duration: 0.1 },
  },
};

const drawerMenuContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Navbar() {
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mounted, setMounted] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastScrollUpdate = 0;
    const SCROLL_THROTTLE = 16; // ~60fps
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollUpdate < SCROLL_THROTTLE) return;
      lastScrollUpdate = now;
      
      const sections = siteConfig.nav.links.map((item) =>
        item.href.substring(1),
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setHasScrolled(latest > 10);
      
      // Show/hide navbar based on scroll direction
      const currentScrollY = latest;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    });
    return unsubscribe;
  }, [scrollY, lastScrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Enhanced Navbar Background with Starfield */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -100 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative"
      >
        {/* Starfield background pattern */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Animated scanning line effect */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Main navbar container */}
        <div className={cn(
          'relative bg-black/85 backdrop-blur-xl border-b transition-all duration-300',
          hasScrolled 
            ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/20' 
            : 'border-gray-800/30'
        )}>
          {/* Enhanced holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-blue-500/5 to-purple-500/8" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${(i * 150 + 50) % 100}%`,
                  top: `${30 + (i * 23) % 40}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 3 + (i % 2),
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
          
          <div className="relative max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
            <div className="flex h-20 items-center justify-between py-4">
              
              {/* Left Section - Enhanced Logo */}
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center gap-3 group">
                  {/* Enhanced logo with starfield effect */}
                  <div className="relative">
                    <motion.span 
                      className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      XERA
                    </motion.span>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 text-2xl font-bold text-cyan-400/20 blur-sm">XERA</div>
                  </div>
                </Link>
              </motion.div>

              {/* Center Section - Enhanced Navigation Menu (hidden when no nav items) */}
              {siteConfig.nav.links.length > 0 && (
                <div className="flex items-center justify-center flex-1">
                  <div className="relative bg-black/60 border border-cyan-500/30 rounded-full px-1 py-1 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-purple-400/5 rounded-full" />
                    {mounted ? (
                      <Suspense fallback={
                        <div className="flex items-center gap-6 px-4 py-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-4 w-16 bg-muted/10 animate-pulse rounded" />
                          ))}
                        </div>
                      }>
                        <NavMenu />
                      </Suspense>
                    ) : (
                      <div className="flex items-center gap-6 px-4 py-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-4 w-16 bg-muted/10 animate-pulse rounded" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Section - Enhanced Action buttons */}
              <div className="flex items-center gap-3">
                {user ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg text-white font-medium text-sm hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 border border-cyan-500/20"
                      href="/dashboard"
                    >
                      <Power className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg text-white font-medium text-sm hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 border border-cyan-500/20"
                      href="/auth"
                    >
                      <Zap className="w-4 h-4" />
                      Get Started
                    </Link>
                  </motion.div>
                )}

                {/* Enhanced Mobile menu button */}
                <motion.button
                  className="md:hidden relative bg-black/80 border border-cyan-500/40 rounded-lg p-2 hover:border-cyan-400/60 transition-colors duration-300 shadow-lg shadow-cyan-500/10"
                  onClick={toggleDrawer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg" />
                  <div className="relative">
                    {isDrawerOpen ? (
                      <X className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Menu className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-x-0 w-[95%] mx-auto bottom-4 bg-black/95 border border-cyan-500/40 p-6 rounded-xl shadow-2xl backdrop-blur-xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              {/* Starfield pattern for mobile drawer */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
              
              {/* Enhanced holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-blue-500/5 to-purple-500/8 rounded-xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              
              {/* Mobile menu content */}
              <div className="relative flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3 group">
                    {/* Enhanced mobile logo */}
                    <motion.span 
                      className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                    >
                      XERA
                    </motion.span>
                  </Link>
                  
                  <motion.button
                    onClick={toggleDrawer}
                    className="bg-black/60 border border-cyan-500/30 rounded-lg p-2 hover:border-cyan-400/50 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </motion.button>
                </div>

                {/* Enhanced Navigation menu (hidden when no nav items) */}
                {siteConfig.nav.links.length > 0 && (
                  <motion.div
                    className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-xl shadow-lg shadow-cyan-500/10"
                    variants={drawerMenuContainerVariants}
                  >
                    <div className="text-xs font-medium text-cyan-400/80 mb-3 tracking-wider">Navigation</div>
                    <AnimatePresence>
                      {siteConfig.nav.links.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="mb-2 last:mb-0"
                          variants={drawerMenuVariants}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <a
                            href={item.href}
                            onClick={(e) => {
                              // If it's an external link (not starting with #), let it navigate normally
                              if (!item.href.startsWith('#')) {
                                setIsDrawerOpen(false);
                                return;
                              }
                              
                              e.preventDefault();
                              
                              // If we're not on the homepage, redirect to homepage with the section
                              if (pathname !== '/') {
                                router.push(`/${item.href}`);
                                setIsDrawerOpen(false);
                                return;
                              }
                              
                              const element = document.getElementById(
                                item.href.substring(1),
                              );
                              element?.scrollIntoView({ behavior: 'smooth' });
                              setIsDrawerOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                              (item.href.startsWith('#') && pathname === '/' && activeSection === item.href.substring(1)) || (item.href === pathname)
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                                : 'text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border hover:border-cyan-500/20'
                            }`}
                          >
                            <div className="w-1 h-1 bg-cyan-400/60 rounded-full" />
                            {item.name}
                          </a>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Enhanced Action buttons */}
                <div className="flex flex-col gap-3">
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg text-white font-medium text-sm hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 border border-cyan-500/20"
                    >
                      <Power className="w-4 h-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/auth"
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg text-white font-medium text-sm hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 border border-cyan-500/20"
                    >
                      <Zap className="w-4 h-4" />
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  ); 
}