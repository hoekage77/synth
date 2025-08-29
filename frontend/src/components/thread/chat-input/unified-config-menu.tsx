'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Check, ChevronDown, Plus, ExternalLink, Crown, Bot, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';
import { useComposioToolkitIcon } from '@/hooks/react-query/composio/use-composio';
import { Skeleton } from '@/components/ui/skeleton';
import { NewAgentDialog } from '@/components/agents/new-agent-dialog';
import { useAgentWorkflows } from '@/hooks/react-query/agents/use-agent-workflows';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import { PlaybookExecuteDialog } from '@/components/playbooks/playbook-execute-dialog';
import { AgentAvatar } from '@/components/thread/content/agent-avatar';
import { ModelSelector } from '@/components/ui/model-selector';
import { useRouter } from 'next/navigation';
import { isLocalMode } from '@/lib/config';

type UnifiedConfigMenuProps = {
    isLoggedIn?: boolean;

    // Agent
    selectedAgentId?: string;
    onAgentSelect?: (agentId: string | undefined) => void;
    hideAgentSelection?: boolean;
    isSunaAgent?: boolean;

    // Model
    selectedModel: string;
    onModelChange: (modelId: string) => void;
    refreshCustomModels?: () => void;
    onUpgradeRequest?: () => void;
};

const LoggedInMenu: React.FC<UnifiedConfigMenuProps> = ({
    isLoggedIn = true,
    selectedAgentId,
    onAgentSelect,
    hideAgentSelection = false,
    isSunaAgent = false,
    selectedModel,
    onModelChange,
    refreshCustomModels,
    onUpgradeRequest,
}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [integrationsOpen, setIntegrationsOpen] = useState(false);
    const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [execDialog, setExecDialog] = useState<{ open: boolean; playbook: any | null; agentId: string | null }>({ open: false, playbook: null, agentId: null });
    const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
    const [dialogInitialData, setDialogInitialData] = useState(null);

    const { data: agentsResponse } = useAgents({}, { enabled: isLoggedIn });
    const agents: any[] = agentsResponse?.agents || [];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            return;
        }
        e.stopPropagation();
    };

    // Only fetch integration icons when authenticated AND the menu is open
    const iconsEnabled = isLoggedIn && isOpen;
    const { data: googleDriveIcon } = useComposioToolkitIcon('googledrive', { enabled: iconsEnabled });
    const { data: slackIcon } = useComposioToolkitIcon('slack', { enabled: iconsEnabled });
    const { data: notionIcon } = useComposioToolkitIcon('notion', { enabled: iconsEnabled });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 30);
        } else {
            setSearchQuery('');
        }
    }, [isOpen]);

    // Keep focus stable even when list size changes
    useEffect(() => {
        if (isOpen) searchInputRef.current?.focus();
    }, [isOpen]);

    const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent Radix dropdown from stealing focus/navigation
        e.stopPropagation();
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
        }
    };

    // Filtered agents with selected first
    const filteredAgents = useMemo(() => {
        const list = [...agents];
        const selected = selectedAgentId ? list.find(a => a.agent_id === selectedAgentId) : undefined;
        const rest = selected ? list.filter(a => a.agent_id !== selectedAgentId) : list;
        const ordered = selected ? [selected, ...rest] : rest;
        return ordered.filter(a => (
            a?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }, [agents, selectedAgentId, searchQuery]);

    // Top 3 slice
    const topAgents = useMemo(() => filteredAgents.slice(0, 3), [filteredAgents]);

    const handleAgentClick = (agentId: string | undefined) => {
        onAgentSelect?.(agentId);
        setIsOpen(false);
    };

    const handleQuickAction = (action: 'instructions' | 'knowledge' | 'triggers') => {
        if (!selectedAgentId && !displayAgent?.agent_id) {
            return;
        }
        const agentId = selectedAgentId || displayAgent?.agent_id;
        router.push(`/agents/config/${agentId}?tab=configuration&accordion=${action}`);
        setIsOpen(false);
    };

    const renderAgentIcon = (agent: any) => {
        // Use a simple Bot icon instead of the AgentAvatar component
        return <Bot className="h-4 w-4 text-muted-foreground" />;
    };

    const displayAgent = useMemo(() => {
        const found = agents.find(a => a.agent_id === selectedAgentId) || agents[0];
        return found;
    }, [agents, selectedAgentId]);

    const currentAgentIdForPlaybooks = isLoggedIn ? displayAgent?.agent_id || '' : '';
    const { data: playbooks = [], isLoading: playbooksLoading } = useAgentWorkflows(currentAgentIdForPlaybooks);
    const [playbooksExpanded, setPlaybooksExpanded] = useState(true);

    return (
        <>
            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(115, 115, 115, 0.1);
                    border-radius: 2px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(115, 115, 115, 0.2);
                }
                .scrollbar-thin {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(115, 115, 115, 0.1) transparent;
                }
            `}</style>

            {/* Unified Agent & Model Selector */}
            <div className="flex items-center gap-2">
                {/* Enhanced Model Selector - ChatGPT-5 Inspired */}
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 px-2 sm:px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200",
                                "border border-border/20 hover:border-border/40 rounded-lg",
                                "font-light text-sm tracking-wide min-w-0 max-w-48 sm:max-w-none"
                            )}
                            onKeyDown={handleKeyDown}
                        >
                            <div className="flex items-center gap-2">
                                {/* Agent Avatar */}
                                {!hideAgentSelection && onAgentSelect && displayAgent ? (
                                    <div className="flex items-center justify-center w-4 h-4">
                                        {renderAgentIcon(displayAgent)}
                                    </div>
                                ) : (
                                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                
                                {/* Dynamic Model Icon */}
                                <div className="flex items-center justify-center w-4 h-4">
                                    <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs border">🤖</div>
                                </div>
                                <div className="flex flex-col items-start min-w-0">
                                    {/* Agent Name */}
                                    {!hideAgentSelection && onAgentSelect && displayAgent && (
                                        <span className="text-xs font-light text-muted-foreground/80 leading-none hidden sm:block truncate">
                                            {displayAgent.name}
                                        </span>
                                    )}
                                    {/* Model Name */}
                                    <span className="font-light leading-none truncate">
                                        <span className="hidden sm:inline">Model</span>
                                        <span className="sm:hidden">Model</span>
                                    </span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-muted-foreground/60 transition-transform duration-200 flex-shrink-0" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        align="start" 
                        className="w-80 max-h-[60vh] overflow-hidden border border-border/20 bg-background/95 backdrop-blur-xl shadow-lg"
                        onKeyDown={handleKeyDown}
                    >
                        {/* Search Header - Minimal and Clean */}
                        <div className="p-4 border-b border-border/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search agents and models..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60 font-light"
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                    {/* Agent Selection Section */}
                    {!hideAgentSelection && onAgentSelect && (
                        <>
                            <div className="px-1.5">
                                <div className="px-3 py-1 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                                    <span>Agents</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0 text-muted-foreground/70 hover:text-foreground hover:bg-muted/20"
                                        onClick={() => { setIsOpen(false); setShowNewAgentDialog(true); }}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="max-h-[20vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                                    {topAgents.length === 0 ? (
                                        <div className="px-3 py-2 text-xs text-muted-foreground/70">No agents</div>
                                    ) : (
                                        topAgents.map((agent) => {
                                            const isSelected = selectedAgentId === agent.agent_id;
                                            return (
                                                <DropdownMenuItem
                                                    key={agent.agent_id}
                                                    className={cn(
                                                        "flex items-center justify-between px-2 py-1.5 cursor-pointer transition-all duration-150 rounded-md mx-1 my-0.5 text-sm",
                                                        isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                                                    )}
                                                    onClick={() => handleAgentClick(agent.agent_id)}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {renderAgentIcon(agent)}
                                                        <span className="font-normal truncate text-sm">{agent.name}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                                    )}
                                                </DropdownMenuItem>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {onAgentSelect && <DropdownMenuSeparator className="!mt-0" />}

                    {/* Models */}
                    <div className="px-1.5">
                        <div className="px-3 py-1 text-[11px] font-medium text-muted-foreground">Models</div>
                        <div className="max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                            <ModelSelector
                                value={selectedModel}
                                onChange={onModelChange}
                                variant="default"
                                showAgentIcon={false}
                                showRecommendedBadge={true}
                                showCustomModelSupport={false}
                                showModelDetails={false}
                                maxHeight="40vh"
                            />
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* AI Agent Capabilities - Enhanced design */}
                    {onAgentSelect && (selectedAgentId || displayAgent?.agent_id) && (
                        <div className="px-1.5">
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="group relative flex items-center rounded-xl gap-3 px-3 py-2.5 mx-0 my-0.5 bg-card/30 border border-border/10 hover:bg-muted/50 hover:border-border/30 transition-all duration-200">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    <div className="relative flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-900/30 group-hover:scale-110 transition-transform duration-200">
                                            <Play className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">Playbooks</span>
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="w-72 rounded-xl max-h-80 overflow-y-auto border border-border/20 bg-background/95 backdrop-blur-xl shadow-lg">
                                        {playbooksLoading ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">Loading…</div>
                                        ) : playbooks && playbooks.length > 0 ? (
                                            playbooks.map((wf: any) => (
                                                <DropdownMenuItem
                                                    key={`pb-${wf.id}`}
                                                    className="group text-sm px-3 py-2.5 mx-1 my-0.5 flex items-center justify-between cursor-pointer rounded-lg hover:bg-muted/50 transition-all duration-150"
                                                    onClick={(e) => { e.stopPropagation(); setExecDialog({ open: true, playbook: wf, agentId: currentAgentIdForPlaybooks }); setIsOpen(false); }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-pink-500/60" />
                                                        <span className="truncate font-medium group-hover:text-foreground transition-colors duration-150">{wf.name}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">No playbooks</div>
                                        )}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuItem
                                            className="group relative text-sm px-3 py-2.5 mx-0 my-0.5 flex items-center justify-between cursor-pointer rounded-xl bg-card/30 border border-border/10 hover:bg-muted/50 hover:border-border/30 transition-all duration-200"
                                            onClick={() => setIntegrationsOpen(true)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            <div className="relative flex items-center gap-3">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-200">
                                                    <ExternalLink className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">Integrations</span>
                                            </div>
                                            <div className="relative flex items-center gap-1.5">
                                                {googleDriveIcon?.icon_url && slackIcon?.icon_url && notionIcon?.icon_url ? (
                                                    <>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={googleDriveIcon.icon_url} className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" alt="Google Drive" />
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={slackIcon.icon_url} className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" alt="Slack" />
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={notionIcon.icon_url} className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200" alt="Notion" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Skeleton className="w-4 h-4 rounded" />
                                                        <Skeleton className="w-3.5 h-3.5 rounded" />
                                                        <Skeleton className="w-3.5 h-3.5 rounded" />
                                                        <Skeleton className="w-3.5 h-3.5 rounded" />
                                                    </>
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    </TooltipTrigger>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}

                        {/* Footer Actions - Minimal and Clean */}
                        <div className="p-4 border-t border-border/10 bg-muted/10">
                            <div className="flex items-center justify-between text-xs text-muted-foreground/70 font-light">
                                <span>Models available</span>
                                {isLocalMode() && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs text-muted-foreground/70 hover:text-foreground hover:bg-muted/20 font-light"
                                        onClick={() => setIsCustomModelDialogOpen(true)}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Custom
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            {/* Integrations manager */}
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

            {/* Create Agent */}
            <NewAgentDialog open={showNewAgentDialog} onOpenChange={setShowNewAgentDialog} />

            {/* Execute Playbook */}
            <PlaybookExecuteDialog
                open={execDialog.open}
                onOpenChange={(open) => setExecDialog((s) => ({ ...s, open }))}
                playbook={execDialog.playbook as any}
                agentId={execDialog.agentId || ''}
            />
        </>
    );
};

const GuestMenu: React.FC<UnifiedConfigMenuProps> = ({
    selectedModel,
    onModelChange,
    hideAgentSelection = false,
}) => {
    return (
        <div className="flex items-center gap-3">
            {/* Simple Model Selector for Guests */}
            <ModelSelector
                value={selectedModel}
                onChange={onModelChange}
                variant="guest"
                showAgentIcon={false}
                showRecommendedBadge={true}
                showCustomModelSupport={false}
                showModelDetails={false}
                maxHeight="50vh"
            />

            {/* Agent Selector - Disabled for guests */}
            {!hideAgentSelection && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 bg-transparent border-2 border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center gap-1.5 cursor-not-allowed opacity-80 pointer-events-none"
                                    disabled
                                >
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">Agent</span>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                            <p>Log in to change agent</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};

export const UnifiedConfigMenu: React.FC<UnifiedConfigMenuProps> = (props) => {
    if (props.isLoggedIn) {
        return <LoggedInMenu {...props} />;
    }
    return <GuestMenu {...props} />;
};

export default UnifiedConfigMenu;


