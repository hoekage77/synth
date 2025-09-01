'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/home';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import GoogleSignIn from '@/components/GoogleSignIn';
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
import { toast } from 'sonner';
import GitHubSignIn from '@/components/GithubSignIn';
import { handleFiles } from '@/components/thread/chat-input/file-upload-handler';
import { useModelSelection } from '@/components/thread/chat-input/_use-model-selection';
import { useFileDelete } from '@/hooks/react-query/files';
import { useQueryClient } from '@tanstack/react-query';
import { VoiceRecorder } from '@/components/thread/chat-input/voice-recorder';
import { UnifiedConfigMenu } from '@/components/thread/chat-input/unified-config-menu';
import { canAccessModel, SubscriptionStatus } from '@/components/thread/chat-input/_use-model-selection';

// Dynamic import for BillingModal
const BillingModal = dynamic(() => import('@/components/billing/billing-modal').then(mod => ({ default: mod.BillingModal })), {
  loading: () => null,
  ssr: false
});

// Custom dialog overlay with blur effect
const BlurredDialogOverlay = () => (
  <DialogOverlay className="bg-background/40 backdrop-blur-md" />
);
BlurredDialogOverlay.displayName = "BlurredDialogOverlay";

// Ultra-Optimized Futuristic Grid Overlay
const FuturisticGrid = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate optimized intersection points
  const intersectionPoints = React.useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const x = (i * 275) % 100; // Reduced density
      const y = (i * 146.6) % 100;
      const delay = (i * 0.2) % 3;

      return (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-cyan-400/50 rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${delay}s`,
            willChange: 'opacity',
          }}
        />
      );
    });
  }, []);

  if (!isVisible) {
    return (
      <div
        ref={gridRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ background: 'transparent' }}
      />
    );
  }

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      {/* Single Optimized SVG with all layers */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >
        <defs>
          {/* Primary Grid Pattern */}
          <pattern
            id="primary-grid"
            width="2"
            height="2"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 2 0 L 0 0 0 2"
              fill="none"
              stroke="rgb(34, 211, 238)"
              strokeWidth="0.03"
              opacity="0.6"
            />
          </pattern>

          {/* Secondary Grid Pattern */}
          <pattern
            id="secondary-grid"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(1, 1)"
          >
            <path
              d="M 4 0 L 0 0 0 4"
              fill="none"
              stroke="rgb(168, 85, 247)"
              strokeWidth="0.02"
              opacity="0.4"
            />
          </pattern>

          {/* Tertiary Grid Pattern */}
          <pattern
            id="tertiary-grid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(2, 2)"
          >
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth="0.015"
              opacity="0.3"
            />
          </pattern>

          {/* Optimized Gradients */}
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="secondaryGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Primary Grid Layer */}
        <g opacity="0.15" className="animate-pulse" style={{ animationDuration: '4s' }}>
          <rect
            width="100"
            height="100"
            fill="url(#primary-grid)"
            stroke="url(#primaryGrad)"
            strokeWidth="0.05"
          />
        </g>

        {/* Secondary Grid Layer */}
        <g opacity="0.1" className="animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}>
          <rect
            width="100"
            height="100"
            fill="url(#secondary-grid)"
            stroke="url(#secondaryGrad)"
            strokeWidth="0.03"
          />
        </g>

        {/* Tertiary Grid Layer */}
        <g opacity="0.08" className="animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}>
          <rect
            width="100"
            height="100"
            fill="url(#tertiary-grid)"
            stroke="none"
          />
        </g>
      </svg>

      {/* Optimized Intersection Points */}
      <div
        className="absolute inset-0"
        style={{
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >
        {intersectionPoints}
      </div>
    </div>
  );
});
FuturisticGrid.displayName = "FuturisticGrid";

// Holographic Orbs Effect
const HolographicOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => {
        // Use deterministic percentage-based positioning to avoid hydration issues
        const baseX = ((i * 137.5) % 100);
        const baseY = ((i * 73.3) % 100);
        const duration = 15 + (i % 10);
        const delay = i * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${baseX}%`,
              y: `${baseY}%`,
              scale: 0
            }}
            animate={{
              x: `${baseX + (i % 3 === 0 ? 10 : i % 3 === 1 ? -10 : 5)}%`,
              y: `${baseY + (i % 2 === 0 ? 8 : -8)}%`,
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay
            }}
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-xl ${
              i % 3 === 0 ? 'from-cyan-400 to-blue-600' :
              i % 3 === 1 ? 'from-purple-400 to-pink-600' :
              'from-green-400 to-emerald-600'
            }`} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Optimized Scanning Lines Effect
const ScanningLines = React.memo(() => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scan-line-1 {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes scan-line-2 {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
        `
      }} />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >
        <div
          className="absolute inset-x-0 h-px opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, rgb(34, 211, 238), transparent)',
            animation: 'scan-line-1 4s linear infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute inset-x-0 h-px opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgb(168, 85, 247), transparent)',
            animation: 'scan-line-2 6s linear infinite 2s',
            willChange: 'transform',
          }}
        />
      </div>
    </>
  );
});
ScanningLines.displayName = "ScanningLines";

// Futuristic Space Background
const FuturisticSpaceBackground = () => {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/20 to-black">
      {/* Star field */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration issues
          const left = ((i * 137.5) % 100) + (i % 10) * 0.1;
          const top = ((i * 73.3) % 100) + (i % 7) * 0.1;
          const delay = (i * 0.1) % 2;
          const duration = 2 + (i % 3);

          return (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Constant for localStorage key to ensure consistency
export function HeroSection() {
  const { hero } = siteConfig;
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

  // Feature flags
  const customAgentsEnabled = true;

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

  // Handle navigation after thread is created
  React.useEffect(() => {
    if (threadQuery.data && initiatedThreadId) {
      const thread = threadQuery.data;
      if (thread.project_id) {
        router.push(`/projects/${thread.project_id}/thread/${initiatedThreadId}`);
      } else {
        // Fallback if no project_id
        router.push(`/agents/${initiatedThreadId}`);
      }
      setInitiatedThreadId(null);
    }
  }, [threadQuery.data, initiatedThreadId, router]);

  return (
    <section ref={heroRef} id="hero" className="w-full relative overflow-hidden min-h-screen bg-black text-white">
      {/* Futuristic Space Background */}
      <FuturisticSpaceBackground />
      
      {/* Futuristic Grid Overlay */}
      <FuturisticGrid />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 pt-32">
        <div className="max-w-6xl mx-auto w-full text-center">
          
          {/* Status Indicator - System Online */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-mono text-sm tracking-wider">
                XERA ONLINE • READY TO WORK
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Your AI Workforce
              </span>
              <span className="block text-white/90">
                That Never Sleeps
              </span>
            </h1>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Stop wasting hours on repetitive tasks.
              <br />
              <span className="text-cyan-400 font-semibold">Deploy Xera to handle research, automation, analysis, and creation while you focus on what matters most.</span>
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={user ? "/dashboard" : "/auth"}
                className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 rounded-xl text-white font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
              >
                {user ? "Enter Dashboard" : "Start Building with Xera"}
              </Link>

              {!user && (
                <button
                  onClick={() => setAuthDialogOpen(true)}
                  className="px-8 py-4 border-2 border-cyan-500/50 rounded-xl text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 font-semibold text-lg"
                >
                  See Xera in Action
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Works 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Human-like intelligence</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Certifications & Trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-16 pt-8 border-t border-gray-800/50"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span>GDPR Ready</span>
              </div>
            </div>
          </motion.div>

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
