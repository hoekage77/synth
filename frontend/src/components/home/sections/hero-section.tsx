'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/home';
import { ArrowRight, Github, X, AlertCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  BillingError,
  AgentRunLimitError,
} from '@/lib/api';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { generateThreadName } from '@/lib/actions/threads';
import GoogleSignIn from '@/components/GoogleSignIn';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { BillingErrorAlert } from '@/components/billing/usage-limit-alert';
import { useBillingError } from '@/hooks/useBillingError';
import { useAccounts } from '@/hooks/use-accounts';
import { isLocalMode, config } from '@/lib/config';
import { toast } from 'sonner';
import GitHubSignIn from '@/components/GithubSignIn';
import { FlickeringGrid } from '../ui/flickering-grid';
import { Examples } from '@/components/dashboard/examples';
import { ChatInput } from '@/components/thread/chat-input/chat-input';

// Dynamic import for BillingModal
const BillingModal = dynamic(() => import('@/components/billing/billing-modal').then(mod => ({ default: mod.BillingModal })), {
  loading: () => null,
  ssr: false
});

// Custom dialog overlay with blur effect
const BlurredDialogOverlay = () => (
  <DialogOverlay className="bg-background/40 backdrop-blur-md" />
);

// Constant for localStorage key to ensure consistency
export function HeroSection() {
  const { hero } = siteConfig;
  const tablet = useMediaQuery('(max-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  
  // Scroll-based transforms
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { billingError, handleBillingError, clearBillingError } =
    useBillingError();
  const { data: accounts } = useAccounts();
  const personalAccount = accounts?.find((account) => account.personal_account);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const initiateAgentMutation = useInitiateAgentMutation();
  const [initiatedThreadId, setInitiatedThreadId] = useState<string | null>(null);
  const threadQuery = useThreadQuery(initiatedThreadId || '');
  const [showAgentLimitDialog, setShowAgentLimitDialog] = useState(false);
  const [agentLimitData, setAgentLimitData] = useState<{
    runningCount: number;
    runningThreadIds: string[];
  } | null>(null);

  // Billing modal state
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const [isInView, setIsInView] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  // Intersection observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Home page performance optimizations active');
    }
    
    // Throttled mouse tracking for interactive effects
    let lastMouseUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseUpdate < 32) return; // Throttle to ~30fps
      lastMouseUpdate = now;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect when scrolling is active to reduce animation complexity
  useEffect(() => {
    let lastScrollUpdate = 0;
    const unsubscribe = scrollY.on('change', () => {
      const now = performance.now();
      if (now - lastScrollUpdate < 16) return; // Throttle to 60fps
      lastScrollUpdate = now;
      
      setIsScrolling(true);

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set a new timeout
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300); // Wait 300ms after scroll stops
    });

    return () => {
      unsubscribe();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [scrollY]);

  function setInputValue(query: string): void {
    throw new Error('Function not implemented.');
  }

  function setSelectedAgentId(agentId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <section ref={heroRef} id="hero" className="w-full relative overflow-hidden min-h-screen bg-black text-white">
      {/* Enhanced background with starfield pattern from testimony */}
      <div className="absolute inset-0">
        {/* Radial gradients for depth */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `
        }} />
        
        {/* Starfield background pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${(i * 137.5) % 100}%`,
                top: `${(i * 73.3) % 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Scanning lines */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
          animate={{ y: ['-100%', '100vh'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 pt-32">
        <div className="max-w-6xl mx-auto w-full text-center">
          
          {/* Main Title - Seamless loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Deploy autonomous AI agents
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                with OS access
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle - Seamless loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Xera is the first truly autonomous AI agent with unrestricted OS access. Scale your team instantly 
              with AI that thinks, plans, and executes like a senior engineer across any digital environment.
            </p>
          </motion.div>

          {/* Call to Action - Seamless loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={user ? "/dashboard" : "/auth"}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg transition-all duration-300"
              >
                                {user ? "Enter Dashboard" : "Deploy Xera"}
              </Link>
              
              {!user && (
                <button
                  onClick={() => setAuthDialogOpen(true)}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-all duration-300 font-medium"
                >
                  Learn More
                </button>
              )}
            </div>
          </motion.div>

        </div>

        {/* Right side flickering grid with gradient fades */}
        <div className="hidden sm:block absolute right-0 top-0 h-[500px] sm:h-[600px] md:h-[800px] w-1/4 sm:w-1/3 -z-10 overflow-hidden">
          {/* Horizontal fade from right to left */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background z-10" />

          {/* Vertical fade from top */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/90 to-transparent z-10" />

          {/* Vertical fade to bottom */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent z-10" />

          {mounted && (
            <FlickeringGrid
              className="h-full w-full"
              squareSize={tablet ? 2 : 2.5}
              gridGap={tablet ? 2 : 2.5}
              color="var(--secondary)"
              maxOpacity={tablet ? 0.2 : 0.4}
              flickerChance={isScrolling ? 0.005 : (tablet ? 0.015 : 0.03)} // Lower performance impact on mobile
            />
          )}
        </div>

        {/* Center content background with rounded bottom */}
        <div className="absolute inset-x-0 sm:inset-x-1/6 md:inset-x-1/4 top-0 h-[500px] sm:h-[600px] md:h-[800px] -z-20 bg-background rounded-b-xl"></div>

        <div className="relative z-10 pt-16 sm:pt-24 md:pt-32 mx-auto h-full w-full max-w-6xl flex flex-col items-center justify-center">
          {/* <p className="border border-border bg-accent rounded-full text-sm h-8 px-3 flex items-center gap-2">
            {hero.badgeIcon}
            {hero.badge}
          </p> */}

          {/* <Link
            href={hero.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border/50 bg-background hover:bg-accent/20 hover:border-secondary/40 rounded-full text-sm h-8 px-3 flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-0.5"
          >
            {hero.badgeIcon}
            <span className="font-medium text-muted-foreground text-xs tracking-wide group-hover:text-primary transition-colors duration-300">
              {hero.badge}
            </span>
            <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-muted/30 group-hover:bg-secondary/30 transition-colors duration-300">
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground group-hover:text-primary"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link> */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center px-2">
              <span className="text-primary">Build, manage and train your </span>
              <span className="text-secondary">AI Workforce.</span>
            </h1>
            <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight max-w-2xl px-2">
            Kortix – the simplest way to migrate from human to AI.
            </p>
          </div>

          <div className="flex flex-col items-center w-full max-w-3xl mx-auto gap-2 flex-wrap justify-center px-2 sm:px-0">
            <div className="w-full relative">
              <div className="relative z-10">
                <ChatInput
                  ref={chatInputRef}
                  onSubmit={handleChatInputSubmit}
                  placeholder="Describe the agent you want to build or the task you want completed..."
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  value={inputValue}
                  onChange={setInputValue}
                  isLoggedIn={!!user}
                  selectedAgentId={setSelectedAgentId}
                  onAgentSelect={setSelectedAgentId}
                  autoFocus={false}
                  enableAdvancedConfig={false}
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute -bottom-4 inset-x-0 h-6 bg-secondary/20 blur-xl rounded-full -z-10 opacity-70"></div>
            </div>
            
            {/* Examples section - right after chat input */}
            <div className="w-full pt-2">
              <Examples onSelectPrompt={setInputValue} count={tablet ? 2 : 4} />
            </div>
          </div>

        </div>

      </div>

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <BlurredDialogOverlay />
        <DialogContent className="sm:max-w-md rounded-xl bg-background border border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-medium">
                Sign in to continue
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Sign in or create an account to access Xera
            </DialogDescription>
          </DialogHeader>

          {/* OAuth Sign In */}
          <div className="w-full">
            <GoogleSignIn returnUrl="/dashboard" />
            <GitHubSignIn returnUrl="/dashboard" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F3F4F6] dark:bg-[#F9FAFB]/[0.02] text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Sign in options */}
          <div className="space-y-4 pt-4">
            <Link
              href={`/auth?returnUrl=${encodeURIComponent('/dashboard')}`}
              className="flex h-12 items-center justify-center w-full text-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
              onClick={() => setAuthDialogOpen(false)}
            >
              Sign in with email
            </Link>

            <Link
              href={`/auth?mode=signup&returnUrl=${encodeURIComponent('/dashboard')}`}
              className="flex h-12 items-center justify-center w-full text-center rounded-full border border-border bg-background hover:bg-accent/20 transition-all"
              onClick={() => setAuthDialogOpen(false)}
            >
              Create new account
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Billing Error Alert here */}
      <BillingErrorAlert
        message={billingError?.message}
        currentUsage={billingError?.currentUsage}
        limit={billingError?.limit}
        accountId={personalAccount?.account_id}
        onDismiss={clearBillingError}
        isOpen={!!billingError}
      />

      {/* Billing Modal */}
       <BillingModal
         open={billingModalOpen}
         onOpenChange={setBillingModalOpen}
         returnUrl={typeof window !== 'undefined' ? window.location.href : '/'}
       />
    </section>
  );
}
