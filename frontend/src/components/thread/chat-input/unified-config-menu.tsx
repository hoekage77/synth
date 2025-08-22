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
import { Cpu, Search, Check, ChevronDown, Plus, ExternalLink, Crown, Bot } from 'lucide-react';
import { useAgents } from '@/hooks/react-query/agents/use-agents';
import { XeraLogo } from '@/components/sidebar/kortix-logo';
import type { ModelOption, SubscriptionStatus } from './_use-model-selection';
import { MODELS, STORAGE_KEY_CUSTOM_MODELS, STORAGE_KEY_MODEL, formatModelName, getCustomModels, MODEL_ICONS } from './_use-model-selection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isLocalMode } from '@/lib/config';
import { CustomModelDialog, type CustomModelFormData } from './custom-model-dialog';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';
import { useComposioToolkitIcon } from '@/hooks/react-query/composio/use-composio';
import { Skeleton } from '@/components/ui/skeleton';
import { NewAgentDialog } from '@/components/agents/new-agent-dialog';
import { useAgentWorkflows } from '@/hooks/react-query/agents/use-agent-workflows';
import { PlaybookExecuteDialog } from '@/components/playbooks/playbook-execute-dialog';
import { AgentAvatar } from '@/components/thread/content/agent-avatar';

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
    modelOptions: ModelOption[];
    subscriptionStatus: SubscriptionStatus;
    canAccessModel: (modelId: string) => boolean;
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
    modelOptions,
    canAccessModel,
    subscriptionStatus,
    onUpgradeRequest,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [integrationsOpen, setIntegrationsOpen] = useState(false);
    const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [execDialog, setExecDialog] = useState<{ open: boolean; playbook: any | null; agentId: string | null }>({ open: false, playbook: null, agentId: null });
    const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
    const [dialogInitialData, setDialogInitialData] = useState<CustomModelFormData>({ id: '', label: '' });
    const [customModels, setCustomModels] = useState<Array<{ id: string; label: string }>>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const { data: agentsResponse } = useAgents({}, { enabled: isLoggedIn });
    const agents: any[] = agentsResponse?.agents || [];

    // Get current model info
    const currentModel = modelOptions.find(m => m.id === selectedModel);
    const isRecommended = currentModel?.recommended;
    const isTopTier = currentModel?.top;

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

    useEffect(() => {
        if (isLocalMode()) {
            setCustomModels(getCustomModels());
        }
    }, []);

    // Keep focus stable even when list size changes
    useEffect(() => {
        if (isOpen) searchInputRef.current?.focus();
    }, [isOpen]);

    const filteredModels = useMemo(() => {
        if (!searchQuery.trim()) return modelOptions;
        const query = searchQuery.toLowerCase();
        return modelOptions.filter(model => 
            model.label.toLowerCase().includes(query) || 
            model.id.toLowerCase().includes(query)
        );
    }, [modelOptions, searchQuery]);

    const handleModelSelect = (modelId: string) => {
        onModelChange(modelId);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev < filteredModels.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev > 0 ? prev - 1 : filteredModels.length - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            const selectedModel = filteredModels[highlightedIndex];
            if (selectedModel) {
                handleModelSelect(selectedModel.id);
            }
        }
    };

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

            {/* Enhanced Model Selector and Agent Selector - Side by Side */}
            <div className="flex items-center gap-2">
                {/* Enhanced Model Selector - ChatGPT-5 Inspired */}
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200",
                                "border border-border/20 hover:border-border/40 rounded-lg",
                                "font-light text-sm tracking-wide"
                            )}
                            onKeyDown={handleKeyDown}
                        >
                            <div className="flex items-center gap-2">
                                {/* Dynamic Model Icon */}
                                <div className="flex items-center justify-center w-4 h-4">
                                    {(() => {
                                        const currentModelData = MODELS[currentModel?.id || ''];
                                        const iconKey = currentModelData?.icon || 'custom';
                                        const iconData = MODEL_ICONS[iconKey];
                                        
                                        if (iconData) {
                                            return (
                                                <div className={cn(
                                                    "w-4 h-4 rounded-sm flex items-center justify-center text-xs",
                                                    iconData.bgColor,
                                                    iconData.borderColor,
                                                    "border"
                                                )}>
                                                    {iconData.icon}
                                                </div>
                                            );
                                        }
                                        return <Cpu className="h-3.5 w-3.5 text-muted-foreground" />;
                                    })()}
                                </div>
                                <span className="font-light">
                                    {currentModel?.label || 'Select Model'}
                                </span>
                                {isRecommended && (
                                    <Crown className="h-3 w-3 text-amber-500/70" />
                                )}
                                {isTopTier && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                )}
                                <ChevronDown className="h-3 w-3 text-muted-foreground/60 transition-transform duration-200" />
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
                                    placeholder="Search models..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60 font-light"
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        {/* Model List */}
                        <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                            {filteredModels.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground/70 font-light">
                                    No models found matching "{searchQuery}"
                                </div>
                            ) : (
                                filteredModels.map((model, index) => {
                                    const isAccessible = canAccessModel(model.id);
                                    const isSelected = model.id === selectedModel;
                                    
                                    return (
                                        <DropdownMenuItem
                                            key={model.id}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all duration-200 rounded-lg mx-1",
                                                isSelected ? "bg-muted/30 text-foreground" : "hover:bg-muted/20 text-muted-foreground hover:text-foreground",
                                                !isAccessible && "opacity-40 cursor-not-allowed",
                                                highlightedIndex === index && "bg-muted/30"
                                            )}
                                            onClick={() => isAccessible && handleModelSelect(model.id)}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                    {/* Dynamic Model Icon */}
                                                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                                        {(() => {
                                                            const modelData = MODELS[model.id];
                                                            const iconKey = modelData?.icon || 'custom';
                                                            const iconData = MODEL_ICONS[iconKey];
                                                            
                                                            if (iconData) {
                                                                return (
                                                                    <div className={cn(
                                                                        "w-4 h-4 rounded-sm flex items-center justify-center text-xs",
                                                                        iconData.bgColor,
                                                                        iconData.borderColor,
                                                                        "border"
                                                                    )}>
                                                                        {iconData.icon}
                                                                    </div>
                                                                );
                                                            }
                                                            return <Cpu className="h-3.5 w-3.5 text-muted-foreground/70" />;
                                                        })()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-light text-sm truncate">
                                                                {model.label}
                                                            </span>
                                                            {model.recommended && (
                                                                <Crown className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                                                            )}
                                                            {model.top && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        {model.description && (
                                                            <p className="text-xs text-muted-foreground/60 truncate font-light">
                                                                {model.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-foreground flex-shrink-0" />
                                            )}
                                            
                                            {!isAccessible && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground/60 font-light">
                                                    <Crown className="h-3 w-3" />
                                                    <span>Upgrade</span>
                                                </div>
                                            )}
                                        </DropdownMenuItem>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer Actions - Minimal and Clean */}
                        <div className="p-4 border-t border-border/10 bg-muted/10">
                            <div className="flex items-center justify-between text-xs text-muted-foreground/70 font-light">
                                <span>{filteredModels.length} models available</span>
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

                {/* Agent Selector - ChatGPT-5 Inspired */}
                {!hideAgentSelection && onAgentSelect && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 border border-border/20 hover:border-border/40 rounded-lg font-light text-sm tracking-wide"
                            >
                                <div className="flex items-center gap-2">
                                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="font-light">
                                        {agents.find(a => a.agent_id === selectedAgentId)?.name || 'Select Agent'}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground/60 transition-transform duration-200" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 border border-border/20 bg-background/95 backdrop-blur-xl shadow-lg">
                            <div className="p-3">
                                <div className="px-3 py-2 text-xs font-light text-muted-foreground/70 flex items-center justify-between">
                                    <span>Agents</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-muted-foreground/70 hover:text-foreground hover:bg-muted/20"
                                        onClick={() => { setIsOpen(false); setShowNewAgentDialog(true); }}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                {agents.length === 0 ? (
                                    <div className="px-3 py-3 text-xs text-muted-foreground/70 font-light">No agents</div>
                                ) : (
                                    <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                                        {agents.map((agent) => (
                                            <DropdownMenuItem
                                                key={agent.agent_id}
                                                className="text-sm px-3 py-2.5 mx-1 my-0.5 flex items-center justify-between cursor-pointer rounded-lg transition-all duration-200 hover:bg-muted/20"
                                                onClick={() => onAgentSelect(agent.agent_id)}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Bot className="h-3.5 w-3.5 text-muted-foreground/70 flex-shrink-0" />
                                                    <span className="truncate font-light">{agent.name}</span>
                                                </div>
                                                {selectedAgentId === agent.agent_id && (
                                                    <Check className="h-4 w-4 text-foreground" />
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
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

            <CustomModelDialog
                isOpen={isCustomModelDialogOpen}
                onClose={() => setIsCustomModelDialogOpen(false)}
                onSave={() => {}}
                initialData={dialogInitialData}
                mode={"add"}
            />
        </>
    );
};

const GuestMenu: React.FC<UnifiedConfigMenuProps> = ({
    selectedModel,
    onModelChange,
    modelOptions,
    canAccessModel,
    hideAgentSelection = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const currentModel = modelOptions.find(m => m.id === selectedModel);
    const isRecommended = currentModel?.recommended;
    const isTopTier = currentModel?.top;

    const filteredModels = useMemo(() => {
        if (!searchQuery.trim()) return modelOptions.filter(m => canAccessModel(m.id));
        const query = searchQuery.toLowerCase();
        return modelOptions.filter(model => 
            canAccessModel(model.id) && (
                model.label.toLowerCase().includes(query) || 
                model.id.toLowerCase().includes(query)
            )
        );
    }, [modelOptions, searchQuery, canAccessModel]);

    const handleModelSelect = (modelId: string) => {
        onModelChange(modelId);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev < filteredModels.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev > 0 ? prev - 1 : filteredModels.length - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            const selectedModel = filteredModels[highlightedIndex];
            if (selectedModel) {
                handleModelSelect(selectedModel.id);
            }
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* Simple Model Selector for Guests */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-9 px-3 border-2 transition-all duration-200 hover:scale-105",
                            isRecommended ? "border-primary/50 bg-primary/5 hover:bg-primary/10" : "border-border hover:border-primary/30",
                            isTopTier ? "shadow-lg shadow-primary/20" : ""
                        )}
                        onKeyDown={handleKeyDown}
                    >
                        <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">
                                {currentModel?.label || 'Select Model'}
                            </span>
                            {isRecommended && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                            {isTopTier && (
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
                            )}
                            <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    align="start" 
                    className="w-80 max-h-[60vh] overflow-hidden"
                    onKeyDown={handleKeyDown}
                >
                    {/* Search Header */}
                    <div className="p-3 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search models..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>

                    {/* Model List */}
                    <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                        {filteredModels.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No models found matching "{searchQuery}"
                            </div>
                        ) : (
                            filteredModels.map((model, index) => {
                                const isSelected = model.id === selectedModel;
                                
                                return (
                                    <DropdownMenuItem
                                        key={model.id}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-150",
                                            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
                                            highlightedIndex === index && "bg-muted/70"
                                        )}
                                        onClick={() => handleModelSelect(model.id)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Cpu className="h-4 w-4 text-primary flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium truncate">
                                                            {model.label}
                                                        </span>
                                                        {model.recommended && (
                                                            <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                                        )}
                                                        {model.top && (
                                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    {model.description && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {model.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                        )}
                                    </DropdownMenuItem>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border bg-muted/30">
                        <div className="text-center text-xs text-muted-foreground">
                            <span>{filteredModels.length} free models available</span>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

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
                                        <span className="font-medium text-sm">Xera</span>
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


