'use client';
import { HeroVideoSection } from '@/components/home/sections/hero-video-section';
import { siteConfig } from '@/lib/home';
import { ArrowRight, Github, X, AlertCircle, Square, Sparkles, Zap, Users, TrendingUp, Star, Play, Upload, FileText, Mic, Loader2 } from 'lucide-react';
import { FlickeringGrid } from '@/components/home/ui/flickering-grid';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState, useEffect, useRef, FormEvent } from 'react';
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
import { useModal } from '@/hooks/use-modal-store';
import GitHubSignIn from '@/components/GithubSignIn';


import { createQueryHook } from '@/hooks/use-query';
import { agentKeys } from '@/hooks/react-query/agents/keys';
import { getAgents } from '@/hooks/react-query/agents/utils';
import { AgentRunLimitDialog } from '@/components/thread/agent-run-limit-dialog';
import { Examples } from '@/components/dashboard/examples';
import { handleFiles } from '@/components/thread/chat-input/file-upload-handler';
import { useModelSelection } from '@/components/thread/chat-input/_use-model-selection';
import { useFileDelete } from '@/hooks/react-query/files';
import { useQueryClient } from '@tanstack/react-query';
import { VoiceRecorder } from '@/components/thread/chat-input/voice-recorder';
import { UnifiedConfigMenu } from '@/components/thread/chat-input/unified-config-menu';
import { canAccessModel, SubscriptionStatus } from '@/components/thread/chat-input/_use-model-selection';
import { useFeatureFlag } from '@/lib/feature-flags';
import { TooltipContent } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { BillingModal } from '@/components/billing/billing-modal';

// Custom dialog overlay with blur effect
const BlurredDialogOverlay = () => (
  <DialogOverlay className="bg-background/40 backdrop-blur-md" />
);

// Futuristic Grid Overlay
const FuturisticGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"/>
          </pattern>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0.3}} />
            <stop offset="50%" style={{stopColor: "hsl(var(--secondary))", stopOpacity: 0.1}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0.3}} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" stroke="url(#gridGrad)" />
      </svg>
    </div>
  );
};

 // Holographic Orbs
 const HolographicOrbs = () => {
   return (
     <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {Array.from({ length: 8 }).map((_, i) => {
         // Use deterministic positioning to avoid hydration issues
         const baseX = ((i * 137.5) % 100) * 0.01 * (typeof window !== 'undefined' ? window.innerWidth : 1200);
         const baseY = ((i * 73.3) % 100) * 0.01 * (typeof window !== 'undefined' ? window.innerHeight : 800);
         const duration = 15 + (i % 10);
         const delay = i * 0.5;
         
         return (
           <motion.div
             key={i}
             className="absolute"
             initial={{ 
               x: baseX,
               y: baseY,
               scale: 0 
             }}
             animate={{
               x: baseX + (i % 3 === 0 ? 100 : i % 3 === 1 ? -100 : 50),
               y: baseY + (i % 2 === 0 ? 80 : -80),
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

// Scanning Lines Effect
const ScanningLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-20"
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
      />
    </div>
  );
};

// Futuristic Space Background
const FuturisticSpaceBackground = () => {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/20 to-black">
      {/* Animated nebula effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, cyan/10 0%, transparent 50%), radial-gradient(circle at 80% 70%, purple/8 0%, transparent 50%), radial-gradient(circle at 50% 50%, blue/5 0%, transparent 70%)",
            "radial-gradient(circle at 30% 70%, purple/12 0%, transparent 50%), radial-gradient(circle at 70% 30%, cyan/6 0%, transparent 50%), radial-gradient(circle at 50% 50%, blue/8 0%, transparent 70%)",
            "radial-gradient(circle at 80% 40%, cyan/8 0%, transparent 50%), radial-gradient(circle at 20% 60%, purple/10 0%, transparent 50%), radial-gradient(circle at 50% 50%, blue/6 0%, transparent 70%)",
            "radial-gradient(circle at 20% 30%, cyan/10 0%, transparent 50%), radial-gradient(circle at 80% 70%, purple/8 0%, transparent 50%), radial-gradient(circle at 50% 50%, blue/5 0%, transparent 70%)",
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
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
const PENDING_PROMPT_KEY = 'pendingAgentPrompt';



export function HeroSection() {
  const { hero } = siteConfig;
  const tablet = useMediaQuery('(max-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const [inputValue, setInputValue] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  
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
  const { onOpen } = useModal();
  const initiateAgentMutation = useInitiateAgentMutation();
  const [initiatedThreadId, setInitiatedThreadId] = useState<string | null>(null);
  const threadQuery = useThreadQuery(initiatedThreadId || '');
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [showAgentLimitDialog, setShowAgentLimitDialog] = useState(false);
  const [agentLimitData, setAgentLimitData] = useState<{
    runningCount: number;
    runningThreadIds: string[];
  } | null>(null);

  // File handling state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Model selection state
  const {
    selectedModel,
    setSelectedModel,
    availableModels,
    allModels,
    subscriptionStatus,
    canAccessModel,
    refreshCustomModels,
  } = useModelSelection();

  // Custom model change handler
  const handleModelChange = (modelId: string) => {
    console.log('Model changed to:', modelId);
    setSelectedModel(modelId);
  };

  // Set default model if none selected and options are available
  useEffect(() => {
    if (!selectedModel && availableModels && availableModels.length > 0) {
      const defaultModel = availableModels.find(model => 
        model.id === 'gpt-4o' || 
        model.id === 'gpt-4' || 
        model.id === 'claude-3-5-sonnet-20241022'
      ) || availableModels[0];
      
      if (defaultModel) {
        console.log('Setting default model:', defaultModel.id);
        setSelectedModel(defaultModel.id);
      }
    }
  }, [selectedModel, availableModels, setSelectedModel]);

  // Debug: Log model selection state
  useEffect(() => {
    console.log('Model selection debug:', {
      selectedModel,
      availableModelsLength: availableModels?.length || 0,
      allModelsLength: allModels?.length || 0,
      hasAvailableModels: !!availableModels,
      subscriptionStatus
    });
  }, [selectedModel, availableModels, allModels, subscriptionStatus]);

  // Feature flags
  const { enabled: customAgentsEnabled, loading: flagsLoading } = useFeatureFlag('custom_agents');

  // Billing modal state
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  
  // Messages array (empty for hero section)
  const messages: any[] = [];
  
  // Sandbox ID (not used in hero section but needed for file handling)
  const sandboxId = undefined;
  
    // File deletion hook
  const deleteFileMutation = useFileDelete();

  // Fetch agents for selection
  const { data: agentsResponse } = createQueryHook(
    agentKeys.list({
      limit: 100,
      sort_by: 'name',
      sort_order: 'asc'
    }),
    () => getAgents({
      limit: 100,
      sort_by: 'name',
      sort_order: 'asc'
    }),
    {
      enabled: !!user && !isLoading,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  )();

  const agents = agentsResponse?.agents || [];

  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect when scrolling is active to reduce animation complexity
  useEffect(() => {
    const unsubscribe = scrollY.on('change', () => {
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

  useEffect(() => {
    if (authDialogOpen && inputValue.trim()) {
      localStorage.setItem(PENDING_PROMPT_KEY, inputValue.trim());
    }
  }, [authDialogOpen, inputValue]);

  useEffect(() => {
    if (authDialogOpen && user && !isLoading) {
      setAuthDialogOpen(false);
      router.push('/dashboard');
    }
  }, [user, isLoading, authDialogOpen, router]);

  useEffect(() => {
    if (threadQuery.data && initiatedThreadId) {
      const thread = threadQuery.data;
      if (thread.project_id) {
        router.push(`/projects/${thread.project_id}/thread/${initiatedThreadId}`);
      } else {
        router.push(`/agents/${initiatedThreadId}`);
      }
      setInitiatedThreadId(null);
    }
  }, [threadQuery.data, initiatedThreadId, router]);

  // File handling functions
  const removeUploadedFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index];

    // Clean up local URL if it exists
    if (fileToRemove.localUrl) {
      URL.revokeObjectURL(fileToRemove.localUrl);
    }

    // Remove from local state immediately for responsive UI
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (!sandboxId && pendingFiles.length > index) {
      setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (fileInputRef.current && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(
        files,
        sandboxId,
        setPendingFiles,
        setUploadedFiles,
        setIsUploading,
        messages,
        queryClient,
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(
        files,
        sandboxId,
        setPendingFiles,
        setUploadedFiles,
        setIsUploading,
        messages,
        queryClient,
      );
    }
  };

  // Voice transcription handler
  const handleTranscription = (transcribedText: string) => {
    const newValue = inputValue ? `${inputValue} ${transcribedText}` : transcribedText;
    setInputValue(newValue);
  };

  // Agent selection handler
  const handleAgentSelect = (agentId: string | undefined) => {
    setSelectedAgentId(agentId);
  };

  // Handle ChatInput submission
  const handleChatInputSubmit = async (
    message: string,
    options?: { model_name?: string; enable_thinking?: boolean }
  ) => {
    if ((!message.trim() && uploadedFiles.length === 0) || isSubmitting) return;

    // If user is not logged in, save prompt and show auth dialog
    if (!user && !isLoading) {
      localStorage.setItem(PENDING_PROMPT_KEY, message.trim());
      setAuthDialogOpen(true);
      return;
    }

          // User is logged in, create the agent
    setIsSubmitting(true);
    try {
      localStorage.removeItem(PENDING_PROMPT_KEY);

      const formData = new FormData();
      formData.append('prompt', message);

      // Add selected agent if one is chosen
      if (selectedAgentId) {
        formData.append('agent_id', selectedAgentId);
      }

      // Add files if any
        if (uploadedFiles.length > 0) {
          uploadedFiles.forEach((file) => {
            if (file.file) {
              formData.append('files', file.file);
            }
          });
        }

      if (options?.model_name) formData.append('model_name', options.model_name);
      formData.append('enable_thinking', String(options?.enable_thinking ?? false));
      formData.append('reasoning_effort', 'low');
      formData.append('stream', 'true');
      formData.append('enable_context_manager', 'false');

      const result = await initiateAgentMutation.mutateAsync(formData);

      if (result.thread_id) {
        setInitiatedThreadId(result.thread_id);
      } else {
        throw new Error('Agent initiation did not return a thread_id.');
      }

      setInputValue('');
        setUploadedFiles([]);
        setPendingFiles([]);
    } catch (error: any) {
      if (error instanceof BillingError) {
        onOpen("paymentRequiredDialog");
      } else if (error instanceof AgentRunLimitError) {
        const { running_thread_ids, running_count } = error.detail;
        
        setAgentLimitData({
          runningCount: running_count,
          runningThreadIds: running_thread_ids,
        });
        setShowAgentLimitDialog(true);
      } else {
        const isConnectionError =
          error instanceof TypeError &&
          error.message.includes('Failed to fetch');
        if (!isLocalMode() || isConnectionError) {
          toast.error(
            error.message || 'Failed to create agent. Please try again.',
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="w-full relative overflow-hidden min-h-screen bg-black text-white">
      {/* Futuristic Space Background */}
      <FuturisticSpaceBackground />
      
      {/* Futuristic Grid Overlay */}
      {mounted && <FuturisticGrid />}
      
      {/* Holographic Orbs */}
      {mounted && <HolographicOrbs />}
      
      {/* Scanning Lines */}
      {mounted && <ScanningLines />}
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 pt-32">
        <div className="max-w-7xl mx-auto w-full text-center">
          
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
                SYSTEM ONLINE • AI WORKFORCE READY
              </span>
            </div>
          </motion.div>

          {/* Main Title - Futuristic Typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                NEURAL
              </motion.span>
              <motion.span 
                className="block font-mono tracking-wider text-white/90"
                initial={{ letterSpacing: "0.1em" }}
                animate={{ letterSpacing: ["0.1em", "0.15em", "0.1em"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                WORKFORCE
              </motion.span>
              <motion.span 
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PROTOCOL
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle with typewriter effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <p className="text-xl sm:text-2xl text-gray-300 font-mono max-w-4xl mx-auto leading-relaxed">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1 }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Deploy autonomous AI agents for complex task execution
              </motion.span>
              <br />
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1.5 }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Research • Automation • Analysis • Creation
              </motion.span>
            </p>
          </motion.div>

          {/* Ultra-Futuristic Command Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Enhanced holographic border with scanning effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50 rounded-xl blur opacity-40 animate-pulse" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 rounded-lg" />
              
              {/* Scanning line overlay */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <div className="relative bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded-lg p-1 shadow-2xl shadow-cyan-500/20">
                {/* Enhanced Terminal header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50" />
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                  </div>
                  <span className="text-cyan-400 font-mono text-sm tracking-wider font-bold">
                    NEURAL_AGENT_DEPLOYMENT_TERMINAL
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
        </div>

                {/* Enhanced Command input */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-cyan-400 font-mono font-bold">$</span>
                    <span className="text-gray-300 font-mono text-sm tracking-wider">
                      xera@neural-network:~$ 
                    </span>
                    <motion.span
                      className="w-2 h-4 bg-cyan-400 rounded-sm"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="relative">
                    {/* Input glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                                         {/* Custom Futuristic ChatInput */}
                     <div 
                       className="relative bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 group/input"
                       onDragOver={handleDragOver}
                       onDragLeave={handleDragLeave}
                       onDrop={handleDrop}
                     >
                       {/* Holographic glow effect on focus */}
                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300" />
                       
                       {/* File attachments display */}
                       {uploadedFiles.length > 0 && (
                         <div className="mb-3 p-2 bg-black/40 rounded-md border border-cyan-500/20">
                           <div className="text-xs text-cyan-400 font-mono mb-2">ATTACHED_FILES:</div>
                           <div className="flex flex-wrap gap-2">
                             {uploadedFiles.map((file, index) => (
                               <div key={index} className="flex items-center gap-2 px-2 py-1 bg-black/60 border border-cyan-500/30 rounded-md">
                                 <span className="text-xs text-cyan-300 font-mono">{file.name}</span>
                                 <button
                                   onClick={() => removeUploadedFile(index)}
                                   className="text-cyan-500 hover:text-cyan-300 transition-colors"
                                 >
                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                                 </button>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                       
                       {/* Textarea */}
                       <textarea
                         ref={chatInputRef}
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         placeholder="Initialize agent deployment sequence..."
                         disabled={isSubmitting}
                         className="relative w-full bg-transparent border-none outline-none resize-none text-cyan-300 placeholder:text-cyan-500/50 font-mono text-sm min-h-[60px] max-h-[120px] focus:ring-0 focus:border-0 transition-colors duration-300 group-focus-within/input:text-cyan-200"
                         style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
                       />
                       
                       {/* Bottom controls */}
                       <div className="flex items-center justify-between mt-3 pt-2 border-t border-cyan-500/20">
                         {/* Left side - File attachment and voice */}
                         <div className="flex items-center gap-2">
                           {/* File attachment */}
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <button
                                   type="button"
                                   className="group/attach relative flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded-md text-cyan-400 hover:bg-cyan-600/20 hover:border-cyan-400/50 transition-all duration-300 font-mono text-xs"
                                   onClick={() => fileInputRef.current?.click()}
                                 >
                                   {/* Holographic glow on hover */}
                                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md opacity-0 group-hover/attach:opacity-100 transition-opacity duration-300" />
                                   
                                   <svg className="relative w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
                                   <span className="relative">ATTACH</span>
                                 </button>
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p>Attach files to your message</p>
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                           
                           {/* Hidden file input */}
                           <input
                             ref={fileInputRef}
                             type="file"
                             multiple
                             className="hidden"
                             onChange={handleFileInputChange}
                           />
                           
                           {/* Voice recorder */}
                           {user && (
                             <VoiceRecorder
                               onTranscription={handleTranscription}
                               disabled={isSubmitting}
                             />
                           )}
                           
                                                                                   {/* Model selector */}
                            <UnifiedConfigMenu
                              selectedModel={selectedModel}
                              onModelChange={handleModelChange}
                              modelOptions={availableModels || allModels || []}
                              subscriptionStatus={subscriptionStatus}
                              canAccessModel={canAccessModel}
                              refreshCustomModels={refreshCustomModels}
                              selectedAgentId={selectedAgentId}
                              onAgentSelect={handleAgentSelect}
                            />
                            
                            {/* Debug info */}
                            <div className="px-2 py-1 bg-black/20 border border-cyan-500/10 rounded text-xs text-cyan-500/60 font-mono">
                              Models: {availableModels?.length || 0} available, {allModels?.length || 0} total
                            </div>
          </div>

                         {/* Right side - Submit button */}
                         <div className="flex items-center gap-2">
                           <button
                             type="button"
                             className="group/submit relative px-3 py-1.5 bg-cyan-600/20 border border-cyan-500/50 rounded-md text-cyan-400 hover:bg-cyan-600/40 hover:border-cyan-400 transition-all duration-300 font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                             disabled={isSubmitting || (!inputValue.trim() && uploadedFiles.length === 0)}
                             onClick={() => handleChatInputSubmit(inputValue)}
                           >
                             {/* Holographic glow on hover */}
                             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-md opacity-0 group-hover/submit:opacity-100 transition-opacity duration-300" />
                             
                             {isSubmitting ? (
                               <div className="relative flex items-center gap-2">
                                 <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                 PROCESSING...
                               </div>
                             ) : (
                               <div className="relative flex items-center gap-2">
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                 </svg>
                                 DEPLOY
                               </div>
                             )}
                           </button>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ultra-Futuristic Quick Commands */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative">
              {/* Futuristic header with scanning effect */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Scanning line */}
                  <motion.div
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Header text with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-lg scale-110" />
                    <div className="relative">
                      <div className="text-sm text-cyan-400 font-mono mb-2 tracking-wider text-center">
                        QUICK_DEPLOY_PROTOCOLS
                      </div>
                      <div className="text-xs text-gray-500 font-mono text-center tracking-wider">
                        SELECT_NEURAL_TASK_SEQUENCE
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            
              {/* Enhanced Examples with futuristic styling */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 rounded-xl blur-xl" />
                
                {/* Examples container */}
                <div className="relative bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4">
              <Examples onSelectPrompt={setInputValue} count={tablet ? 2 : 4} />
            </div>
          </div>
            </div>
          </motion.div>

          {/* Quick Deploy Protocols */}
          {/* Examples component removed - duplicate of the one above */}

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
              {/* <button 
                onClick={() => setAuthDialogOpen(false)}
                className="rounded-full p-1 hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button> */}
            </div>
            <DialogDescription className="text-muted-foreground">
              Sign in or create an account to talk with Xera
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

      {agentLimitData && (
        <AgentRunLimitDialog
          open={showAgentLimitDialog}
          onOpenChange={setShowAgentLimitDialog}
          runningCount={agentLimitData.runningCount}
          runningThreadIds={agentLimitData.runningThreadIds}
          projectId={undefined} // Hero section doesn't have a specific project context
        />
      )}

       {/* Billing Modal */}
       <BillingModal
         open={billingModalOpen}
         onOpenChange={setBillingModalOpen}
         returnUrl={typeof window !== 'undefined' ? window.location.href : '/'}
       />
    </section>
  );
}
