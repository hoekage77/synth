import React, { forwardRef, useEffect, useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Square, Loader2, ArrowUp, Brain, Database, Zap, ExternalLink, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile } from './chat-input';
import { FileUploadHandler } from './file-upload-handler';
import { VoiceRecorder } from './voice-recorder';
import { UnifiedConfigMenu } from './unified-config-menu';
import { canAccessModel, SubscriptionStatus } from './_use-model-selection';
import { isLocalMode } from '@/lib/config';
import { useFeatureFlag } from '@/lib/feature-flags';
import { TooltipContent } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { BillingModal } from '@/components/billing/billing-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';
import { handleFiles } from './file-upload-handler';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import { useRouter } from 'next/navigation';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTranscription: (text: string) => void;
  placeholder: string;
  loading: boolean;
  disabled: boolean;
  isAgentRunning: boolean;
  onStopAgent?: () => void;
  isDraggingOver: boolean;
  uploadedFiles: UploadedFile[];

  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  sandboxId?: string;
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  hideAttachments?: boolean;
  messages?: any[]; // Add messages prop
  isLoggedIn?: boolean;

  selectedModel: string;
  onModelChange: (model: string) => void;
  modelOptions: any[];
  subscriptionStatus: SubscriptionStatus;
  canAccessModel: (modelId: string) => boolean;
  refreshCustomModels?: () => void;
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string | undefined) => void;
  enableAdvancedConfig?: boolean;
  hideAgentSelection?: boolean;
  isSunaAgent?: boolean;
}

export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onTranscription,
      placeholder,
      loading,
      disabled,
      isAgentRunning,
      onStopAgent,
      isDraggingOver,
      uploadedFiles,

      fileInputRef,
      isUploading,
      sandboxId,
      setPendingFiles,
      setUploadedFiles,
      setIsUploading,
      hideAttachments = false,
      messages = [],
      isLoggedIn = true,

      selectedModel,
      onModelChange,
      modelOptions,
      subscriptionStatus,
      canAccessModel,
      refreshCustomModels,

      selectedAgentId,
      onAgentSelect,
      enableAdvancedConfig = false,
      hideAgentSelection = false,
      isSunaAgent,
    },
    ref,
  ) => {
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [integrationsOpen, setIntegrationsOpen] = useState(false);
    const { enabled: customAgentsEnabled, loading: flagsLoading } = useFeatureFlag('custom_agents');
    const router = useRouter();
    
    // Fetch agents to get the selected agent's data
    const { data: agentsResponse } = useAgents({
      limit: 100,
      sort_by: 'name',
      sort_order: 'asc'
    });
    
    const agents = agentsResponse?.agents || [];
    const displayAgent = useMemo(() => {
      const found = agents.find(a => a.agent_id === selectedAgentId) || agents[0];
      return found;
    }, [agents, selectedAgentId]);
    
    const handleQuickAction = (action: 'instructions' | 'knowledge' | 'triggers' | 'integrations' | 'playbooks') => {
      if (!selectedAgentId && !displayAgent?.agent_id) {
        return;
      }
      const agentId = selectedAgentId || displayAgent?.agent_id;
      
      if (action === 'integrations') {
        setIntegrationsOpen(true);
        return;
      }
      
      if (action === 'playbooks') {
        router.push(`/agents/config/${agentId}?tab=workflows`);
        return;
      }
      
      router.push(`/agents/config/${agentId}?tab=configuration&accordion=${action}`);
    };

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      const textarea = ref as React.RefObject<HTMLTextAreaElement>;
      if (!textarea.current) return;

      const adjustHeight = () => {
        const el = textarea.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.maxHeight = '200px';
        el.style.overflowY = el.scrollHeight > 200 ? 'auto' : 'hidden';

        const newHeight = Math.min(el.scrollHeight, 200);
        el.style.height = `${newHeight}px`;
      };

      adjustHeight();

      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, [value, ref]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        if (
          (value.trim() || uploadedFiles.length > 0) &&
          !loading &&
          (!disabled || isAgentRunning)
        ) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!e.clipboardData) return;
      const items = Array.from(e.clipboardData.items);
      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        e.preventDefault();
        handleFiles(
          imageFiles,
          sandboxId,
          setPendingFiles,
          setUploadedFiles,
          setIsUploading,
          messages,
        );
      }
    };

    const renderDropdown = () => {
      const showAdvancedFeatures = isLoggedIn && (enableAdvancedConfig || (customAgentsEnabled && !flagsLoading));
      // Don't render dropdown components until after hydration to prevent ID mismatches
      if (!mounted) {
        return <div className="flex items-center gap-2 h-8" />; // Placeholder with same height
      }
      // Unified compact menu for both logged and non-logged (non-logged shows only models subset via menu trigger)
      return (
        <div className="flex items-center gap-2">
          <UnifiedConfigMenu
            isLoggedIn={isLoggedIn}
            selectedAgentId={showAdvancedFeatures && !hideAgentSelection ? selectedAgentId : undefined}
            onAgentSelect={showAdvancedFeatures && !hideAgentSelection ? onAgentSelect : undefined}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            modelOptions={modelOptions}
            subscriptionStatus={subscriptionStatus}
            canAccessModel={canAccessModel}
            refreshCustomModels={refreshCustomModels}
          />
        </div>
      );
    }

    return (
      <div className="relative flex flex-col w-full">
                 {/* AI Agent Capabilities - Enhanced card-based design */}
         {onAgentSelect && (selectedAgentId || displayAgent?.agent_id) && (
           <div className="flex items-center justify-center gap-2 px-2 mb-3">
             <Button
               variant="ghost"
               size="sm"
               className="group relative h-8 px-3 text-xs font-medium bg-card/50 border border-border/20 rounded-xl hover:bg-muted/50 hover:border-border/40 transition-all duration-200 hover:scale-105 hover:shadow-sm"
               onClick={() => handleQuickAction('instructions')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
               <div className="relative flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-200">
                   <Brain className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                 </div>
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Instructions</span>
               </div>
             </Button>
             <Button
               variant="ghost"
               size="sm"
               className="group relative h-8 px-3 text-xs font-medium bg-card/50 border border-border/20 rounded-xl hover:bg-muted/50 hover:border-border/40 transition-all duration-200 hover:scale-105 hover:shadow-sm"
               onClick={() => handleQuickAction('knowledge')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
               <div className="relative flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 rounded-md bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform duration-200">
                   <Database className="h-3 w-3 text-green-600 dark:text-green-400" />
                 </div>
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Knowledge</span>
               </div>
             </Button>
             <Button
               variant="ghost"
               size="sm"
               className="group relative h-8 px-3 text-xs font-medium bg-card/50 border border-border/20 rounded-xl hover:bg-muted/50 hover:border-border/40 transition-all duration-200 hover:scale-105 hover:shadow-sm"
               onClick={() => handleQuickAction('triggers')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
               <div className="relative flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 rounded-md bg-orange-100 dark:bg-orange-900/30 group-hover:scale-110 transition-transform duration-200">
                   <Zap className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                 </div>
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Triggers</span>
               </div>
             </Button>
             <Button
               variant="ghost"
               size="sm"
               className="group relative h-8 px-3 text-xs font-medium bg-card/50 border border-border/20 rounded-xl hover:bg-muted/50 hover:border-border/40 transition-all duration-200 hover:scale-105 hover:shadow-sm"
               onClick={() => handleQuickAction('integrations')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
               <div className="relative flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-200">
                   <ExternalLink className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                 </div>
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Integrations</span>
               </div>
             </Button>
             <Button
               variant="ghost"
               size="sm"
               className="group relative h-8 px-3 text-xs font-medium bg-card/50 border border-border/20 rounded-xl hover:bg-muted/50 hover:border-border/40 transition-all duration-200 hover:scale-105 hover:shadow-sm"
               onClick={() => handleQuickAction('playbooks')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
               <div className="relative flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 rounded-md bg-pink-100 dark:bg-pink-900/30 group-hover:scale-110 transition-transform duration-200">
                   <Play className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                 </div>
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Playbooks</span>
               </div>
             </Button>
           </div>
         )}
        
        <div className="flex items-end gap-2 px-2">
          <div className="flex-1 flex flex-col gap-1">
            <Textarea
              ref={ref}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              className={cn(
                'w-full bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 px-0.5 py-3 !text-[15px] min-h-[40px] max-h-[200px] overflow-y-auto resize-none',
                isDraggingOver ? 'opacity-40' : '',
              )}
              disabled={loading || (disabled && !isAgentRunning)}
              rows={1}
            />
          </div>
          
          {/* Submit/Stop Button - positioned at bottom right */}
          <Button
            type="submit"
            onClick={isAgentRunning && onStopAgent ? onStopAgent : onSubmit}
            size="sm"
            className={cn(
              'w-8 h-8 flex-shrink-0 rounded-xl mb-1',
              (!value.trim() && uploadedFiles.length === 0 && !isAgentRunning) ||
                loading ||
                (disabled && !isAgentRunning)
                ? 'opacity-50'
                : '',
            )}
            disabled={
              (!value.trim() && uploadedFiles.length === 0 && !isAgentRunning) ||
              loading ||
              (disabled && !isAgentRunning)
            }
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAgentRunning ? (
              <Square className="h-3 w-3" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between mt-2 px-2 gap-2 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            {!hideAttachments && (
              <FileUploadHandler
                ref={fileInputRef}
                loading={loading}
                disabled={disabled}
                isAgentRunning={isAgentRunning}
                isUploading={isUploading}
                sandboxId={sandboxId}
                setPendingFiles={setPendingFiles}
                setUploadedFiles={setUploadedFiles}
                setIsUploading={setIsUploading}
                messages={messages}
                isLoggedIn={isLoggedIn}
              />
            )}

            {isLoggedIn && (
              <VoiceRecorder
                onTranscription={onTranscription}
                disabled={loading || (disabled && !isAgentRunning)}
              />
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            {renderDropdown()}
            <BillingModal
              open={billingModalOpen}
              onOpenChange={setBillingModalOpen}
              returnUrl={typeof window !== 'undefined' ? window.location.href : '/'}
            />
          </div>
        </div>
        
        {/* Integrations Dialog */}
        <Dialog open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
          <DialogContent className="p-0 max-w-6xl h-[90vh] overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Integrations</DialogTitle>
            </DialogHeader>
            <IntegrationsRegistry
              showAgentSelector={true}
              selectedAgentId={selectedAgentId}
              onAgentChange={onAgentSelect}
              onClose={() => setIntegrationsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);

MessageInput.displayName = 'MessageInput';