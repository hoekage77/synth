'use client';

import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import {
  ChatInput,
  ChatInputHandles,
} from '@/components/thread/chat-input/chat-input';
import {
  BillingError,
  AgentRunLimitError,
} from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBillingError } from '@/hooks/useBillingError';
import { BillingErrorAlert } from '@/components/billing/usage-limit-alert';
import { useAccounts } from '@/hooks/use-accounts';
import { config, isLocalMode, isStagingMode } from '@/lib/config';
import { useInitiateAgentWithInvalidation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import { cn } from '@/lib/utils';
import { BillingModal } from '@/components/billing/billing-modal';
import { useAgentSelection } from '@/lib/stores/agent-selection-store';

import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { normalizeFilenameToNFC } from '@/lib/utils/unicode';
import { AgentRunLimitDialog } from '@/components/thread/agent-run-limit-dialog';
import { useFeatureFlag } from '@/lib/feature-flags';
import { toast } from 'sonner';
import { ReleaseBadge } from '../auth/release-badge';
import { useDashboardTour } from '@/hooks/use-dashboard-tour';
import { TourConfirmationDialog } from '@/components/tour/TourConfirmationDialog';
import { Calendar, MessageSquare, Plus, Sparkles, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';

const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

const dashboardTourSteps: Step[] = [
  {
    target: '[data-tour="dashboard-main"]',
    content: 'Welcome to your Xera dashboard! This is your central hub for AI-powered tasks and conversations.',
    title: 'Welcome to Xera',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="chat-input"]',
    content: 'Type your questions or tasks here. Xera can help with research, analysis, automation, and much more.',
    title: 'Start a Conversation',
    placement: 'top',
    disableBeacon: true,
  },

  {
    target: '[data-tour="new-task"]',
    content: 'Start a new task or conversation with Xera. This button takes you to the main dashboard where you can begin your AI-powered workflow.',
    title: 'New Task',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="command-center"]',
    content: 'Access your command center in the sidebar. Here you can manage agents, view threads, and access all your AI tools in one place.',
    title: 'Command Center',
    placement: 'right',
    disableBeacon: true,
  },
];

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
  const { data: accounts } = useAccounts();
  const personalAccount = accounts?.find((account) => account.personal_account);
  const chatInputRef = React.useRef<ChatInputHandles>(null);
  const initiateAgentMutation = useInitiateAgentWithInvalidation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Tour integration
  const {
    run,
    stepIndex,
    setStepIndex,
    stopTour,
    showWelcome,
    handleWelcomeAccept,
    handleWelcomeDecline,
  } = useDashboardTour();

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
  const agentAvatar = undefined;
  const isSunaAgent = selectedAgent?.metadata?.is_suna_default || false;

  const threadQuery = useThreadQuery(initiatedThreadId || '');

  const enabledEnvironment = isStagingMode() || isLocalMode();

  React.useEffect(() => {
    if (agents.length > 0) {
      initializeFromAgents(agents, undefined, setSelectedAgent);
    }
  }, [agents, initializeFromAgents, setSelectedAgent]);

  React.useEffect(() => {
    const agentIdFromUrl = searchParams.get('agent_id');
    if (agentIdFromUrl && agentIdFromUrl !== selectedAgentId) {
      setSelectedAgent(agentIdFromUrl);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('agent_id');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, selectedAgentId, router, setSelectedAgent]);

  React.useEffect(() => {
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

  const handleTourCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTour();
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  }, [stopTour, setStepIndex]);

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
        setShowPaymentModal(true);
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const pendingPrompt = localStorage.getItem(PENDING_PROMPT_KEY);

      if (pendingPrompt) {
        setInputValue(pendingPrompt);
        setAutoSubmit(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
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
      <Joyride
        steps={dashboardTourSteps}
        run={run}
        stepIndex={stepIndex}
        callback={handleTourCallback}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        disableScrollParentFix
        scrollToFirstStep
        scrollOffset={100}
        spotlightClicks
        styles={{
          options: {
            primaryColor: '#3b82f6',
            backgroundColor: '#0f172a',
            textColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.85)',
            arrowColor: '#0f172a',
            zIndex: 10000,
          },
          tooltip: {
            backgroundColor: 'transparent',
            borderRadius: 20,
            fontSize: 15,
            padding: 0,
            boxShadow: 'none',
            border: 'none',
          },
          tooltipTitle: {
            color: 'transparent',
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 16,
            background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
          tooltipContent: {
            color: '#cbd5e1',
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 20,
          },
          buttonNext: {
            backgroundColor: 'transparent',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontSize: 14,
            padding: '14px 20px',
            borderRadius: 12,
            border: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          buttonBack: {
            color: '#94a3b8',
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
            fontSize: 14,
            padding: '14px 20px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 12,
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          buttonSkip: {
            color: '#94a3b8',
            backgroundColor: 'transparent',
            fontSize: 14,
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.2s ease',
          },
          buttonClose: {
            color: '#94a3b8',
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
            fontSize: 16,
            padding: '8px',
            borderRadius: 8,
            transition: 'all 0.2s ease',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        }}
      />
      
      <TourConfirmationDialog
        open={showWelcome}
        onAccept={handleWelcomeAccept}
        onDecline={handleWelcomeDecline}
      />

      <BillingModal 
        open={showPaymentModal} 
        onOpenChange={setShowPaymentModal}
        showUsageLimitAlert={true}
      />
      <div className="dashboard-scroll-container flex flex-col h-full w-full bg-background" data-tour="dashboard-main">
        {/* Scrollable Content Area */}
        <div className="dashboard-scroll-content flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full flex flex-col">
            {/* Header Section */}
            {customAgentsEnabled && (
              <div className="flex justify-center px-4 pt-6">
                <ReleaseBadge text="Custom Agents, Playbooks, and more!" link="/agents?tab=my-agents" />
              </div>
            )}
            
            {/* Main Content - Centered layout with examples above chat input */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pb-32">
              <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
                {/* Logo/Branding Area */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center mb-2">
                    <div className="text-xl font-bold text-primary">X</div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
                    How can I help you today?
                  </h1>
                  <p className="text-lg text-muted-foreground font-light max-w-md">
                    I'm Xera, your AI assistant. I can help with research, analysis, automation, and much more.
                  </p>
                </div>
                

              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Chat Input at Bottom */}
        <div className="flex-shrink-0 px-4 pb-8 pt-4 bg-background/95 backdrop-blur-sm border-t border-border/20 sticky bottom-0" data-tour="chat-input">
          <div className="w-full max-w-2xl mx-auto">
            <ChatInput
              ref={chatInputRef}
              onSubmit={handleSubmit}
              loading={isSubmitting}
              placeholder="Message Xera..."
              value={inputValue}
              onChange={setInputValue}
              hideAttachments={false}
              selectedAgentId={selectedAgentId}
              onAgentSelect={setSelectedAgent}
              hideAgentSelection={false}
              enableAdvancedConfig={true}
              onConfigureAgent={(agentId) => router.push(`/agents/config/${agentId}`)}
            />
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
