'use client';

import { Icons } from '@/components/home/icons';
import { NavMenu } from '@/components/home/nav-menu';
import { siteConfig } from '@/lib/home';
import { cn } from '@/lib/utils';
import { Menu, X, Cpu, Power, Zap } from 'lucide-react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

const INITIAL_WIDTH = '70rem';
const MAX_WIDTH = '1000px';

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
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
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

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);



  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Futuristic Navbar Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        {/* Scanning line effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
        
        {/* Main navbar container */}
        <div className={cn(
          'relative bg-black/80 backdrop-blur-lg border-b transition-all duration-300',
          hasScrolled 
            ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
            : 'border-gray-800/50'
        )}>
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
          
                                <div className="relative max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
             <div className="flex h-20 items-center justify-between py-4">
               
               {/* Left Section - Futuristic Logo */}
               <motion.div 
                 className="flex items-center gap-4"
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.2 }}
               >
                                  <Link href="/" className="flex items-center gap-3 group">
                    {/* Clean white text logo */}
                    <span className="text-2xl font-bold text-white">XERA</span>
                  </Link>
               </motion.div>

               {/* Center Section - Navigation Menu */}
               <div className="flex items-center justify-center flex-1">
                 <div className="relative bg-black/40 border border-gray-700/50 rounded-full px-1 py-1 backdrop-blur-sm">
                   <NavMenu />
                 </div>
               </div>

                               {/* Right Section - Actions */}
                <div className="flex items-center gap-4">
                 {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {user ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-white font-mono text-sm hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                        href="/dashboard"
                      >
                        <Power className="w-4 h-4" />
                        CONTROL_PANEL
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-white font-mono text-sm hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                        href="/auth"
                      >
                        <Zap className="w-4 h-4" />
                        INITIALIZE
                      </Link>
                    </motion.div>
                  )}

                  {/* Mobile menu button */}
                  <motion.button
                    className="md:hidden relative bg-black/60 border border-cyan-500/30 rounded-lg p-2 hover:border-cyan-400/50 transition-colors duration-300"
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
        </div>
      </motion.div>

      {/* Futuristic Mobile Drawer */}
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
              className="fixed inset-x-0 w-[95%] mx-auto bottom-4 bg-black/90 border border-cyan-500/30 p-6 rounded-xl shadow-2xl backdrop-blur-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 rounded-xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
              
              {/* Mobile menu content */}
              <div className="relative flex flex-col gap-6">
                <div className="flex items-center justify-between">
                                     <Link href="/" className="flex items-center gap-3 group">
                     {/* Clean mobile logo */}
                     <span className="text-xl font-bold text-white">XERA</span>
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

                {/* Navigation menu */}
                <motion.div
                  className="bg-black/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm"
                  variants={drawerMenuContainerVariants}
                >
                  <div className="text-xs font-mono text-gray-400 mb-3 tracking-wider">NAVIGATION_MENU</div>
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
                          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-sm transition-all duration-300 ${
                            (item.href.startsWith('#') && pathname === '/' && activeSection === item.href.substring(1)) || (item.href === pathname)
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'text-gray-300 hover:bg-gray-800/50 hover:text-cyan-400'
                          }`}
                        >
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {item.name.toUpperCase()}
                        </a>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-white font-mono text-sm hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                    >
                      <Power className="w-4 h-4" />
                      CONTROL_PANEL
                    </Link>
                  ) : (
                    <Link
                      href="/auth"
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg text-white font-mono text-sm hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      INITIALIZE
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
