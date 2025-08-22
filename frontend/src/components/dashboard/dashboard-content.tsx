'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  ChatInput,
  ChatInputHandles,
} from '@/components/thread/chat-input/chat-input';
import {
  BillingError,
  AgentRunLimitError,
} from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useBillingError } from '@/hooks/useBillingError';
import { BillingErrorAlert } from '@/components/billing/usage-limit-alert';
import { useAccounts } from '@/hooks/use-accounts';
import { config } from '@/lib/config';
import { useInitiateAgentWithInvalidation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { ModalProviders } from '@/providers/modal-providers';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal-store';
import { useAgentSelection } from '@/lib/stores/agent-selection-store';
import { Examples } from './examples';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { normalizeFilenameToNFC } from '@/lib/utils/unicode';
import { AgentRunLimitDialog } from '@/components/thread/agent-run-limit-dialog';
import { useFeatureFlag } from '@/lib/feature-flags';
import { CustomAgentsSection } from './custom-agents-section';
import { toast } from 'sonner';
import { ReleaseBadge } from '../auth/release-badge';
import { Ripple } from '@/components/ui/ripple';
import { Bot, Cpu, Network, BookOpen, ArrowUpRight, Zap, FileText, Play } from 'lucide-react';

const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

export function DashboardContent() {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const { 
    selectedAgentId, 
    setSelectedAgent, 
    initializeFromAgents,
    getCurrentAgent
  } = useAgentSelection();
  const [initiatedThreadId, setInitiatedThreadId] = useState<string | null>(null);
  const { billingError, handleBillingError, clearBillingError } =
    useBillingError();
  const [showAgentLimitDialog, setShowAgentLimitDialog] = useState(false);
  const [agentLimitData, setAgentLimitData] = useState<{
    runningCount: number;
    runningThreadIds: string[];
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { data: accounts } = useAccounts();
  const personalAccount = accounts?.find((account) => account.personal_account);
  const chatInputRef = useRef<ChatInputHandles>(null);
  const initiateAgentMutation = useInitiateAgentWithInvalidation();
  const { onOpen } = useModal();

  // Feature flag for custom agents section
  const { enabled: customAgentsEnabled } = useFeatureFlag('custom_agents');

  // Fetch agents to get the selected agent's name
  const { data: agentsResponse } = useAgents({
    limit: 100,
    sort_by: 'name',
    sort_order: 'asc'
  });

  const agents = agentsResponse?.agents || [];
  const selectedAgent = selectedAgentId
    ? agents.find(agent => agent.agent_id === selectedAgentId)
    : null;
  const displayName = selectedAgent?.name || 'Xera';
  const agentAvatar = selectedAgent?.avatar;
  const isSunaAgent = selectedAgent?.metadata?.is_suna_default || false;

  const threadQuery = useThreadQuery(initiatedThreadId || '');

  useEffect(() => {
    console.log('🚀 Dashboard effect:', { 
      agentsLength: agents.length, 
      selectedAgentId, 
      agents: agents.map(a => ({ id: a.agent_id, name: a.name, isDefault: a.metadata?.is_suna_default })) 
    });
    
    if (agents.length > 0) {
      console.log('📞 Calling initializeFromAgents');
      initializeFromAgents(agents, undefined, setSelectedAgent);
    }
  }, [agents, initializeFromAgents, setSelectedAgent]);

  useEffect(() => {
    const agentIdFromUrl = searchParams.get('agent_id');
    if (agentIdFromUrl && agentIdFromUrl !== selectedAgentId) {
      setSelectedAgent(agentIdFromUrl);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('agent_id');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, selectedAgentId, router, setSelectedAgent]);

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

  const handleSubmit = async (
    message: string,
    options?: {
      model_name?: string;
      enable_thinking?: boolean;
      reasoning_effort?: string;
      stream?: boolean;
      enable_context_manager?: boolean;
    },
  ) => {
    if (
      (!message.trim() && !chatInputRef.current?.getPendingFiles().length) ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);

    try {
      const files = chatInputRef.current?.getPendingFiles() || [];
      localStorage.removeItem(PENDING_PROMPT_KEY);

      const formData = new FormData();
      formData.append('prompt', message);

      // Add selected agent if one is chosen
      if (selectedAgentId) {
        formData.append('agent_id', selectedAgentId);
      }

      files.forEach((file, index) => {
        const normalizedName = normalizeFilenameToNFC(file.name);
        formData.append('files', file, normalizedName);
      });

      if (options?.model_name) formData.append('model_name', options.model_name);
      formData.append('enable_thinking', String(options?.enable_thinking ?? false));
      formData.append('reasoning_effort', options?.reasoning_effort ?? 'low');
      formData.append('stream', String(options?.stream ?? true));
      formData.append('enable_context_manager', String(options?.enable_context_manager ?? false));

      const result = await initiateAgentMutation.mutateAsync(formData);

      if (result.thread_id) {
        setInitiatedThreadId(result.thread_id);
      } else {
        throw new Error('Agent initiation did not return a thread_id.');
      }
      chatInputRef.current?.clearPendingFiles();
    } catch (error: any) {
      console.error('Error during submission process:', error);
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
        const errorMessage = error instanceof Error ? error.message : 'Operation failed';
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingPrompt = localStorage.getItem(PENDING_PROMPT_KEY);

      if (pendingPrompt) {
        setInputValue(pendingPrompt);
        setAutoSubmit(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoSubmit && inputValue && !isSubmitting) {
      const timer = setTimeout(() => {
        handleSubmit(inputValue);
        setAutoSubmit(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoSubmit, inputValue, isSubmitting]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Sleek ChatGPT-5 Inspired Design */}
          <div className="space-y-8 mb-8">
            {/* Hero Section - Minimal and Elegant */}
            <div className="text-center space-y-6">
              {/* Subtle gradient accent */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto opacity-60 animate-pulse"></div>
              
              {/* Main heading - Clean and modern */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground animate-in fade-in duration-1000">
                Welcome to{' '}
                <span className="font-medium bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                  Xera
                </span>
              </h1>
              
              {/* Subtitle - Minimal and elegant */}
              <p className="text-base sm:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-200">
                Your AI workspace is ready. Start a conversation or explore what's possible.
              </p>
            </div>

            {/* Main Chat Input - Centered and Prominent */}
            <div className="w-full max-w-2xl mx-auto">
              {/* Custom ChatGPT-5 inspired styling */}
              <style jsx>{`
                .chatgpt5-input .bg-background {
                  background: transparent !important;
                }
                .chatgpt5-input .border {
                  border: 1px solid hsl(var(--border) / 0.2) !important;
                  border-radius: 24px !important;
                  background: hsl(var(--background)) !important;
                  backdrop-filter: blur(20px) !important;
                  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08) !important;
                }
                .chatgpt5-input .border:hover {
                  border-color: hsl(var(--border) / 0.4) !important;
                  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.12) !important;
                }
                .chatgpt5-input textarea {
                  font-size: 16px !important;
                  line-height: 1.5 !important;
                  padding: 16px 20px !important;
                }
                .chatgpt5-input textarea::placeholder {
                  color: hsl(var(--muted-foreground) / 0.6) !important;
                  font-weight: 400 !important;
                }
                .chatgpt5-input button[type="submit"] {
                  background: hsl(var(--foreground)) !important;
                  color: hsl(var(--background)) !important;
                  border-radius: 16px !important;
                  width: 32px !important;
                  height: 32px !important;
                  transition: all 0.2s ease !important;
                  position: relative !important;
                  margin: 0 !important;
                }
                .chatgpt5-input button[type="submit"]:hover {
                  transform: scale(1.05) !important;
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
                }
                .chatgpt5-input button[type="submit"]:disabled {
                  opacity: 0.4 !important;
                  transform: none !important;
                }
                .chatgpt5-input .flex.items-center.justify-between {
                  position: relative !important;
                  z-index: 1 !important;
                }
              `}</style>
              
              <div className="chatgpt5-input">
                <ChatInput
                  ref={chatInputRef}
                  onSubmit={handleSubmit}
                  placeholder="Message Xera..."
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  value={inputValue}
                  onChange={setInputValue}
                  onFileBrowse={() => {}}
                  selectedAgentId={selectedAgentId}
                  onAgentSelect={setSelectedAgent}
                  agentName={displayName}
                  messages={[]}
                  bgColor="bg-background"
                  toolCalls={[]}
                  toolCallIndex={0}
                  showToolPreview={false}
                  onExpandToolPreview={() => {}}
                  onStopAgent={() => {}}
                  isAgentRunning={false}
                  autoFocus={false}
                  hideAttachments={true}
                  hideAgentSelection={false}
                  defaultShowSnackbar={false}
                  showToLowCreditUsers={false}
                  agentMetadata={{}}
                  showScrollToBottomIndicator={false}
                  onScrollToBottom={() => {}}
                  isLoggedIn={true}
                  enableAdvancedConfig={true}
                  onConfigureAgent={() => {}}
                  sandboxId={undefined}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in duration-1000 delay-400">
              <Button
                variant="ghost"
                onClick={() => router.push('/agents/config/new')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              >
                <Bot className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
              
              <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
              
              <Button
                variant="ghost"
                onClick={() => router.push('/agents')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              >
                <Cpu className="h-4 w-4 mr-2" />
                Manage Agents
              </Button>
            </div>
          </div>
        </div>
      </div>
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
          projectId={undefined}
        />
      )}
    </div>
  );
}
