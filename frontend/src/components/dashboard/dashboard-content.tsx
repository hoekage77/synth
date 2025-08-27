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
import { Cpu, Network, BookOpen, ArrowUpRight, Zap, FileText, Play, Brain, Globe, Code, Briefcase, Workflow, Database } from 'lucide-react';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

export function DashboardContent() {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [registryDialogOpen, setRegistryDialogOpen] = useState(false);
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
    <>
      <div className="flex flex-col h-screen bg-background">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-0 relative">
          {/* Centered Content */}
          <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome Header */}
            <div className="text-center space-y-2 md:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-tight">
                Hello, I'm{' '}
                <span className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Xera
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light">
                How can I help you today?
              </p>
            </div>

            {/* Example Grid */}
            <div className={cn(
              "grid gap-3 mx-auto",
              isMobile ? "grid-cols-1 max-w-full" : "grid-cols-1 md:grid-cols-2 max-w-2xl"
            )}>
              <button
                onClick={() => {
                  setInputValue("Explain quantum computing");
                  handleSubmit("Explain quantum computing");
                }}
                className={cn(
                  "group rounded-xl border border-border/50 hover:border-border transition-all duration-200 text-left hover:bg-muted/30 bg-card/50",
                  isMobile ? "p-4 min-h-[80px] active:scale-[0.98]" : "p-4"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                      isMobile ? "text-sm" : "text-base"
                    )}>
                      Explain quantum computing
                    </div>
                    <div className={cn(
                      "text-muted-foreground mt-1",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      Learn about quantum mechanics and computing
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setInputValue("Plan a 7-day trip to Japan");
                  handleSubmit("Plan a 7-day trip to Japan");
                }}
                className={cn(
                  "group rounded-xl border border-border/50 hover:border-border transition-all duration-200 text-left hover:bg-muted/30 bg-card/50",
                  isMobile ? "p-4 min-h-[80px] active:scale-[0.98]" : "p-4"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors",
                      isMobile ? "text-sm" : "text-base"
                    )}>
                      Plan a 7-day trip to Japan
                    </div>
                    <div className={cn(
                      "text-muted-foreground mt-1",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      Get a detailed itinerary with recommendations
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setInputValue("Write a Python script to analyze data");
                  handleSubmit("Write a Python script to analyze data");
                }}
                className={cn(
                  "group rounded-xl border border-border/50 hover:border-border transition-all duration-200 text-left hover:bg-muted/30 bg-card/50",
                  isMobile ? "p-4 min-h-[80px] active:scale-[0.98]" : "p-4"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",
                      isMobile ? "text-sm" : "text-base"
                    )}>
                      Write a Python script
                    </div>
                    <div className={cn(
                      "text-muted-foreground mt-1",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      Generate code with explanations
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setInputValue("Create a business plan for a startup");
                  handleSubmit("Create a business plan for a startup");
                }}
                className={cn(
                  "group rounded-xl border border-border/50 hover:border-border transition-all duration-200 text-left hover:bg-muted/30 bg-card/50",
                  isMobile ? "p-4 min-h-[80px] active:scale-[0.98]" : "p-4"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors",
                      isMobile ? "text-sm" : "text-base"
                    )}>
                      Create a business plan
                    </div>
                    <div className={cn(
                      "text-muted-foreground mt-1",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      Develop a comprehensive startup strategy
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="w-full border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className={cn(
            "w-full mx-auto space-y-3 md:space-y-4",
            isMobile ? "px-3 py-3 max-w-full" : "px-4 py-4 max-w-4xl"
          )}>
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
              hideAttachments={false}
              hideAgentSelection={false}
              defaultShowSnackbar={false}
              showToLowCreditUsers={false}
              agentMetadata={{}}
              showScrollToBottomIndicator={false}
              onScrollToBottom={() => {}}
              isLoggedIn={true}
              enableAdvancedConfig={false}
              onConfigureAgent={() => {}}
              sandboxId={undefined}
            />
            
            {/* Quick Access Tools */}
            <div className={cn(
              "flex items-center justify-center",
              isMobile ? "gap-3 flex-wrap" : "gap-6"
            )}>
              <button 
                onClick={() => setRegistryDialogOpen(true)}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  isMobile ? "text-xs p-2 min-h-[44px] active:scale-95" : "text-sm"
                )}
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm" />
                  <div className="w-4 h-4 bg-green-500 rounded-sm -ml-1" />
                  <div className="w-4 h-4 bg-orange-500 rounded-sm -ml-1" />
                </div>
                <span className="font-medium">Integrations</span>
              </button>
              
              <button 
                onClick={() => {
                  if (selectedAgentId) {
                    router.push(`/agents/config/${selectedAgentId}?tab=configuration&accordion=instructions`);
                  } else {
                    toast.error('Please select an agent first');
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  isMobile ? "text-xs p-2 min-h-[44px] active:scale-95" : "text-sm"
                )}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="font-medium">Instructions</span>
              </button>
              
              <button 
                onClick={() => {
                  if (selectedAgentId) {
                    router.push(`/agents/config/${selectedAgentId}?tab=configuration&accordion=knowledge`);
                  } else {
                    toast.error('Please select an agent first');
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  isMobile ? "text-xs p-2 min-h-[44px] active:scale-95" : "text-sm"
                )}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                  <BookOpen className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="font-medium">Knowledge</span>
              </button>
              
              <button 
                onClick={() => {
                  if (selectedAgentId) {
                    router.push(`/agents/config/${selectedAgentId}?tab=configuration&accordion=triggers`);
                  } else {
                    toast.error('Please select an agent first');
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  isMobile ? "text-xs p-2 min-h-[44px] active:scale-95" : "text-sm"
                )}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded flex items-center justify-center">
                  <Zap className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="font-medium">Triggers</span>
              </button>
              
              <button 
                onClick={() => {
                  if (selectedAgentId) {
                    router.push(`/agents/config/${selectedAgentId}?tab=configuration&accordion=workflows`);
                  } else {
                    toast.error('Please select an agent first');
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                  isMobile ? "text-xs p-2 min-h-[44px] active:scale-95" : "text-sm"
                )}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                  <Workflow className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="font-medium">Playbooks</span>
              </button>
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
      
      <Dialog open={registryDialogOpen} onOpenChange={setRegistryDialogOpen}>
        <DialogContent className="p-0 max-w-6xl h-[90vh] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Integrations</DialogTitle>
          </DialogHeader>
          <IntegrationsRegistry
            showAgentSelector={true}
            selectedAgentId={selectedAgentId}
            onAgentChange={setSelectedAgent}
            onClose={() => setRegistryDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
