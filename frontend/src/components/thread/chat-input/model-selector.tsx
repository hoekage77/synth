'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Check, Search, AlertTriangle, Crown, ArrowUpRight, Brain, Plus, Edit, Trash, Cpu, KeyRound, ExternalLink } from 'lucide-react';


import { cn } from '@/lib/utils';
import { isLocalMode } from '@/lib/config';
import { CustomModelDialog, CustomModelFormData } from './custom-model-dialog';
import { getCustomModels, STORAGE_KEY_CUSTOM_MODELS, STORAGE_KEY_MODEL, DEFAULT_FREE_MODEL_ID, MODELS, formatModelName, MODEL_ICONS } from './_use-model-selection';
import Link from 'next/link';
import { IntegrationsRegistry } from '@/components/agents/integrations-registry';
import { ComposioConnector } from '@/components/agents/composio/composio-connector';
import { useComposioToolkitIcon } from '@/hooks/react-query/composio/use-composio';
import { useComposioProfiles } from '@/hooks/react-query/composio/use-composio-profiles';
import { useAgent } from '@/hooks/react-query/agents/use-agents';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeatureFlag } from '@/lib/feature-flags';

const PREDEFINED_APPS = [
  {
    id: 'googledrive',
    name: 'Google Drive',
    slug: 'googledrive',
    description: 'Access and manage files in Google Drive'
  },
  {
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    description: 'Send messages and manage channels'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    slug: 'gmail',
    description: 'Send and manage emails'
  },
  {
    id: 'notion',
    name: 'Notion',
    slug: 'notion',
    description: 'Create and manage Notion pages'
  }
];

interface CustomModel {
  id: string;
  label: string;
}




interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  modelOptions: any[];
  canAccessModel: (modelId: string) => boolean;
  subscriptionStatus: any;
  refreshCustomModels: () => void;
  billingModalOpen: boolean;
  setBillingModalOpen: (open: boolean) => void;
  hasBorder?: boolean;
  selectedAgentId?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  modelOptions,
  canAccessModel,
  subscriptionStatus,
  refreshCustomModels,
  billingModalOpen,
  setBillingModalOpen,
  hasBorder = false,
  selectedAgentId,
}) => {
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [lockedModel, setLockedModel] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fix hydration mismatch by ensuring component only renders after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom models state
  const [customModels, setCustomModels] = useState<CustomModel[]>([]);
  const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
  const [dialogInitialData, setDialogInitialData] = useState<CustomModelFormData>({ id: '', label: '' });
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingModelId, setEditingModelId] = useState<string | null>(null);

  const [showIntegrationsManager, setShowIntegrationsManager] = useState(false);
  const [selectedApp, setSelectedApp] = useState<typeof PREDEFINED_APPS[0] | null>(null);
  const [showComposioConnector, setShowComposioConnector] = useState(false);

  const { data: googleDriveIcon } = useComposioToolkitIcon('googledrive', { enabled: true });
  const { data: slackIcon } = useComposioToolkitIcon('slack', { enabled: true });
  const { data: gmailIcon } = useComposioToolkitIcon('gmail', { enabled: true });
  const { data: notionIcon } = useComposioToolkitIcon('notion', { enabled: true });

  const { data: selectedAppIcon } = useComposioToolkitIcon(selectedApp?.slug || '', {
    enabled: !!selectedApp?.slug && showComposioConnector
  });

  const appIconMap = {
    'googledrive': googleDriveIcon?.icon_url,
    'slack': slackIcon?.icon_url,
    'gmail': gmailIcon?.icon_url,
    'notion': notionIcon?.icon_url,
  };

  const { data: agent } = useAgent(selectedAgentId || '');
  const { data: profiles } = useComposioProfiles();

  const { enabled: customAgentsEnabled } = useFeatureFlag('custom_agents');

  const isAppConnectedToAgent = (appSlug: string): boolean => {
    if (!selectedAgentId || !agent?.custom_mcps || !profiles) return false;

    return agent.custom_mcps.some((mcpConfig: any) => {
      if (mcpConfig.config?.profile_id) {
        const profile = profiles.find(p => p.profile_id === mcpConfig.config.profile_id);
        return profile?.toolkit_slug === appSlug;
      }
      return false;
    });
  };

  useEffect(() => {
    if (isLocalMode()) {
      setCustomModels(getCustomModels());
    }
  }, []);

  useEffect(() => {
    if (isLocalMode() && customModels.length > 0) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(customModels));
    }
  }, [customModels]);

  const modelMap = new Map();

  modelOptions.forEach(model => {
    modelMap.set(model.id, {
      ...model,
      isCustom: false
    });
  });

  if (isLocalMode()) {
    customModels.forEach(model => {
      if (!modelMap.has(model.id)) {
        modelMap.set(model.id, {
          id: model.id,
          label: model.label || formatModelName(model.id),
          requiresSubscription: false,
          top: false,
          isCustom: true
        });
      } else {
        const existingModel = modelMap.get(model.id);
        modelMap.set(model.id, {
          ...existingModel,
          isCustom: true
        });
      }
    });
  }

  const enhancedModelOptions = Array.from(modelMap.values());

  const filteredOptions = enhancedModelOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFreeModels = () => modelOptions.filter(m => !m.requiresSubscription).map(m => m.id);

  const sortedModels = filteredOptions;
  

  const getUniqueModelKey = (model: any, index: number): string => {
    return `model-${model.id}-${index}`;
  };

  const uniqueModels = sortedModels.map((model, index) => ({
    ...model,
    uniqueKey: getUniqueModelKey(model, index)
  }));

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const selectedLabel =
    enhancedModelOptions.find((o) => o.id === selectedModel)?.label || 'Select model';

  const handleSelect = (id: string) => {
    const isCustomModel = customModels.some(model => model.id === id);
    if (isCustomModel && isLocalMode()) {
      onModelChange(id);
      setIsOpen(false);
      return;
    }
    if (canAccessModel(id)) {
      onModelChange(id);
      setIsOpen(false);
    } else {
      setLockedModel(id);
      setPaywallOpen(true);
    }
  };

  const handleUpgradeClick = () => {
    setBillingModalOpen(true);
  };

  const closeDialog = () => {
    setPaywallOpen(false);
    setLockedModel(null);
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedOption = filteredOptions[highlightedIndex];
      if (selectedOption) {
        handleSelect(selectedOption.id);
      }
    }
  };

  

  

  const openAddCustomModelDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDialogInitialData({ id: '', label: '' });
    setDialogMode('add');
    setIsCustomModelDialogOpen(true);
    setIsOpen(false);
  };

  const openEditCustomModelDialog = (model: CustomModel, e?: React.MouseEvent) => {
    e?.stopPropagation();

    setDialogInitialData({ id: model.id, label: model.label });
    setEditingModelId(model.id);
    setDialogMode('edit');
    setIsCustomModelDialogOpen(true);
    setIsOpen(false);
  };

  const handleSaveCustomModel = (formData: CustomModelFormData) => {
    const modelId = formData.id.trim();
    const displayId = modelId.startsWith('openrouter/') ? modelId.replace('openrouter/', '') : modelId;
    const modelLabel = formData.label.trim() || formatModelName(displayId);

    if (!modelId) return;
    const checkId = modelId;
    if (customModels.some(model =>
      model.id === checkId && (dialogMode === 'add' || model.id !== editingModelId))) {
      console.error('A model with this ID already exists');
      return;
    }

    closeCustomModelDialog();
    const newModel = { id: modelId, label: modelLabel };

    const updatedModels = dialogMode === 'add'
      ? [...customModels, newModel]
      : customModels.map(model => model.id === editingModelId ? newModel : model);

    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(updatedModels));
    } catch (error) {
      console.error('Failed to save custom models to localStorage:', error);
    }

    setCustomModels(updatedModels);
    if (refreshCustomModels) {
      refreshCustomModels();
    }

    if (dialogMode === 'add') {
      onModelChange(modelId);
      try {
        localStorage.setItem(STORAGE_KEY_MODEL, modelId);
      } catch (error) {
        console.warn('Failed to save selected model to localStorage:', error);
      }
    } else if (selectedModel === editingModelId) {
      onModelChange(modelId);
      try {
        localStorage.setItem(STORAGE_KEY_MODEL, modelId);
      } catch (error) {
        console.warn('Failed to save selected model to localStorage:', error);
      }
    }
    setIsOpen(false);
    setTimeout(() => {
      setHighlightedIndex(-1);
    }, 0);
  };

  const closeCustomModelDialog = () => {
    setIsCustomModelDialogOpen(false);
    setDialogInitialData({ id: '', label: '' });
    setEditingModelId(null);
    document.body.classList.remove('overflow-hidden');
    const bodyStyle = document.body.style;
    setTimeout(() => {
      bodyStyle.pointerEvents = '';
      bodyStyle.removeProperty('pointer-events');
    }, 150);
  };

  const handleDeleteCustomModel = (modelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    const updatedCustomModels = customModels.filter(model => model.id !== modelId);
    if (isLocalMode() && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(updatedCustomModels));
      } catch (error) {
        console.error('Failed to update custom models in localStorage:', error);
      }
    }
    setCustomModels(updatedCustomModels);
    if (refreshCustomModels) {
      refreshCustomModels();
    }
    if (selectedModel === modelId) {
      const defaultModel = isLocalMode() ? DEFAULT_FREE_MODEL_ID : DEFAULT_FREE_MODEL_ID;
      onModelChange(defaultModel);
      try {
        localStorage.setItem(STORAGE_KEY_MODEL, defaultModel);
      } catch (error) {
        console.warn('Failed to update selected model in localStorage:', error);
      }
    }
    setIsOpen(false);
    setTimeout(() => {
      setHighlightedIndex(-1);
      if (isOpen) {
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 50);
      }
    }, 10);
  };

  const handleAppSelect = (app: typeof PREDEFINED_APPS[0]) => {
    setSelectedApp(app);
    setShowComposioConnector(true);
    setIsOpen(false);
  };

  const handleComposioComplete = (profileId: string, appName: string, appSlug: string) => {
    setShowComposioConnector(false);
    setSelectedApp(null);
  };

  const handleOpenIntegrationsManager = () => {
    setShowIntegrationsManager(true);
    setIsOpen(false);
  };

  const renderModelOption = (opt: any, index: number) => {
    const isCustom = Boolean(opt.isCustom) ||
      (isLocalMode() && customModels.some(model => model.id === opt.id));

    const accessible = isCustom ? true : canAccessModel(opt.id);
    const isHighlighted = index === highlightedIndex;
    
    const isLowQuality = MODELS[opt.id]?.lowQuality || false;
    const isRecommended = MODELS[opt.id]?.recommended || false;
    
    // Get model icon and styling
    const modelIcon = isCustom ? MODEL_ICONS.custom : MODEL_ICONS[MODELS[opt.id]?.icon || 'custom'];
    const isSelected = selectedModel === opt.id;

    return (
      <TooltipProvider key={opt.uniqueKey || `model-${opt.id}-${index}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='w-full'>
              <DropdownMenuItem
                className={cn(
                  "text-sm px-4 py-3 mx-2 my-1 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                  isHighlighted && "bg-accent/50 scale-[1.02]",
                  !accessible && "opacity-70",
                  isSelected && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                )}
                onClick={() => handleSelect(opt.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Model Icon with Brand Colors */}
                  <div className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-200",
                    modelIcon.bgColor,
                    modelIcon.borderColor,
                    isSelected && "scale-110 shadow-lg"
                  )}>
                    <span className="text-lg">{modelIcon.icon}</span>
                    
                    {/* Quality indicator overlay */}
                    {isLowQuality && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center">
                        <AlertTriangle className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Model Info */}
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className={cn(
                      "font-semibold text-foreground truncate w-full",
                      isSelected && "text-primary"
                    )}>
                      {opt.label}
                    </span>
                    
                    {/* Model provider badge */}
                    <div className="flex items-center gap-2 mt-1">
                      {isRecommended && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-300 font-medium border border-blue-500/30">
                          ⭐ Recommended
                        </span>
                      )}
                      
                      {isCustom && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-600 dark:text-gray-300 font-medium border border-gray-500/30">
                          Custom
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right side actions */}
                <div className="flex items-center gap-2 ml-2">
                  {isLocalMode() && isCustom && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCustomModelDialog(opt, e);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomModel(opt.id, e);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            </div>
          </TooltipTrigger>
          {!accessible ? (
            <TooltipContent side="left" className="text-xs max-w-xs">
              <p>Upgrade required to access this model</p>
            </TooltipContent>
          ) : isLowQuality ? (
            <TooltipContent side="left" className="text-xs max-w-xs">
              <p>Not recommended for complex tasks</p>
            </TooltipContent>
          ) : isRecommended ? (
            <TooltipContent side="left" className="text-xs max-w-xs">
              <p>Recommended for optimal performance</p>
            </TooltipContent>
          ) : isCustom ? (
            <TooltipContent side="left" className="text-xs max-w-xs">
              <p>Custom model</p>
            </TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>
    );
  };

  useEffect(() => {
    setHighlightedIndex(-1);
    setSearchQuery('');
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 10);
    }
  }, [customModels, modelOptions]);

  // Don't render dropdown until after hydration to prevent ID mismatches
  if (!mounted) {
    return <div className="h-8 px-2 py-2" />; // Placeholder with same height
  }

  return (
    <div className="relative">
      {/* Mobile Dialog Fallback */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 py-2 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-white/10 rounded-xl text-foreground hover:text-foreground hover:from-background/90 hover:to-background/70 hover:border-white/20 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl touch-manipulation sm:hidden"
          >
            <div className="relative flex items-center justify-center">
              {/* Show selected model icon or default CPU icon */}
              {(() => {
                const modelIcon = MODEL_ICONS[MODELS[selectedModel]?.icon || 'custom'];
                return (
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center text-sm",
                    modelIcon.bgColor,
                    modelIcon.borderColor
                  )}>
                    <span>{modelIcon.icon}</span>
                  </div>
                );
              })()}
              
              {/* Quality warning indicator */}
              {MODELS[selectedModel]?.lowQuality && (
                <AlertTriangle className="h-2.5 w-2.5 text-amber-500 absolute -top-1 -right-1" />
              )}
            </div>
            
            {/* Model name */}
            <span className="text-sm font-medium">
              {selectedLabel}
            </span>
            
            {/* Dropdown arrow */}
            <div className="w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:hidden w-[95vw] max-w-md p-0 overflow-hidden border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl">
          <div className="max-h-[70vh] overflow-y-auto w-full">
            <div className="p-3">
              {/* Header with gradient accent */}
              <div className="mb-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full mx-auto mb-3" />
                <h3 className="text-center text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Models
                </h3>
                <p className="text-center text-xs text-muted-foreground mt-1">
                  Choose your AI companion
                </p>
              </div>
              
              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchInputKeyDown}
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
              </div>
              
              {/* Model List */}
              <div className="space-y-2">
                {uniqueModels.map((opt, index) => {
                  const isCustom = customModels.some(model => model.id === opt.id);
                  const accessible = canAccessModel(opt.id);
                  const isHighlighted = index === highlightedIndex;
                  const isLowQuality = MODELS[opt.id]?.lowQuality;
                  const isRecommended = MODELS[opt.id]?.recommended;
                  
                  // Get model icon and styling
                  const modelIcon = isCustom ? MODEL_ICONS.custom : MODEL_ICONS[MODELS[opt.id]?.icon || 'custom'];
                  const isSelected = selectedModel === opt.id;

                  return (
                    <div
                      key={opt.uniqueKey || `model-${opt.id}-${index}`}
                      className={cn(
                        "text-sm px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 border border-transparent",
                        isHighlighted && "bg-accent/50 scale-[1.02]",
                        !accessible && "opacity-70",
                        isSelected && "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                      )}
                      onClick={() => handleSelect(opt.id)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {/* Model Icon with Brand Colors */}
                        <div className={cn(
                          "relative flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-200",
                          modelIcon.bgColor,
                          modelIcon.borderColor,
                          isSelected && "scale-110 shadow-lg"
                        )}>
                          <span className="text-lg">{modelIcon.icon}</span>
                          
                          {/* Quality indicator overlay */}
                          {isLowQuality && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center">
                              <AlertTriangle className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Model Info */}
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className={cn(
                            "font-semibold text-foreground truncate w-full",
                            isSelected && "text-primary"
                          )}>
                            {opt.label}
                          </span>
                          
                          {/* Model provider badge */}
                          <div className="flex items-center gap-2 mt-1">
                            {isRecommended && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-300 font-medium border border-blue-500/30">
                                ⭐ Recommended
                              </span>
                            )}
                            
                            {isCustom && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-600 dark:text-gray-300 font-medium border border-gray-500/30">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 py-2 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-white/10 rounded-xl text-foreground hover:text-foreground hover:from-background/90 hover:to-background/70 hover:border-white/20 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl touch-manipulation hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Show selected model icon or default CPU icon */}
                    {(() => {
                      const modelIcon = MODEL_ICONS[MODELS[selectedModel]?.icon || 'custom'];
                      return (
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center text-sm",
                          modelIcon.bgColor,
                          modelIcon.borderColor
                        )}>
                          <span>{modelIcon.icon}</span>
                        </div>
                      );
                    })()}
                    
                    {/* Quality warning indicator */}
                    {MODELS[selectedModel]?.lowQuality && (
                      <AlertTriangle className="h-2.5 w-2.5 text-amber-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  
                  {/* Model name */}
                  <span className="text-sm font-medium">
                    {selectedLabel}
                  </span>
                  
                  {/* Dropdown arrow */}
                  <div className="w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>Choose a model</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          align="end"
          className="w-80 p-0 overflow-hidden border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl z-50 hidden sm:block"
          sideOffset={4}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[500px] overflow-y-auto w-full">
            <div className="p-3">
              {/* Header with gradient accent */}
              <div className="mb-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full mx-auto mb-3" />
                <h3 className="text-center text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Models
                </h3>
                <p className="text-center text-xs text-muted-foreground mt-1">
                  Choose your AI companion
                </p>
              </div>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center rounded-xl gap-3 px-3 py-2.5 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 border border-white/10 transition-all duration-200">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Cpu className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-foreground">Available Models</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-80 border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl">
                    <div className="px-4 py-3 flex justify-between items-center border-b border-white/10">
                      <span className="text-sm font-semibold text-foreground">Model Library</span>
                      {isLocalMode() && (
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href="/settings/env-manager"
                                  className="h-6 w-6 p-0 flex items-center justify-center"
                                >
                                  <KeyRound className="h-3.5 w-3.5" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">
                                Local .Env Manager
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openAddCustomModelDialog(e);
                                  }}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">
                                Add a custom model
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <div className="relative flex items-center">
                        <div className="absolute left-3 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <Search className="h-3 w-3 text-blue-500" />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search AI models..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchInputKeyDown}
                          className="w-full h-10 px-10 py-2 rounded-xl text-sm focus:outline-none bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>
                    
                    <div>
                        {uniqueModels
                          .filter(m =>
                            m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.id.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((model, index) => renderModelOption(model, index))}
                        {uniqueModels.length === 0 && (
                          <div className="text-sm text-center py-4 text-muted-foreground">
                            No models match your search
                          </div>
                        )}
                      </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {customAgentsEnabled && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex rounded-lg items-center gap-2 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">Quick Connect</span>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      {googleDriveIcon?.icon_url && slackIcon?.icon_url && notionIcon?.icon_url ? (
                        <>
                          <img src={googleDriveIcon.icon_url} className="w-5 h-5" alt="Google Drive" />
                          <img src={slackIcon.icon_url} className="w-4 h-4" alt="Slack" />
                          <img src={notionIcon.icon_url} className="w-4 h-4" alt="Notion" />
                        </>
                      ) : (
                        <>
                          <Skeleton className="w-4 h-4 rounded-md" />
                          <Skeleton className="w-4 h-4 rounded-md" />
                          <Skeleton className="w-4 h-4 rounded-md" />
                        </>
                      )}
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-64 rounded-xl">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Popular Apps
                      </div>
                      <div className="px-1 space-y-1">
                        {!selectedAgentId || !agent || !profiles ? (
                          <>
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div key={index} className="px-3 py-2 mx-0 my-0.5 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Skeleton className="w-4 h-4 mr-2 rounded" />
                                  <Skeleton className="w-20 h-4 rounded" />
                                </div>
                                <Skeleton className="w-4 h-4 rounded" />
                              </div>
                            ))}
                          </>
                        ) : (
                          PREDEFINED_APPS.map((app) => {
                            const isConnected = isAppConnectedToAgent(app.slug);
                            return (
                              <TooltipProvider key={app.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuItem
                                      className={cn(
                                        "text-sm px-3 rounded-lg py-2 mx-0 my-0.5 flex items-center justify-between",
                                        isConnected 
                                          ? "opacity-60 cursor-not-allowed" 
                                          : "cursor-pointer hover:bg-accent/50"
                                      )}
                                      onClick={isConnected ? undefined : () => handleAppSelect(app)}
                                      disabled={isConnected}
                                    >
                                      <div className="flex items-center">
                                        {appIconMap[app.slug] ? (
                                          <img src={appIconMap[app.slug]} alt={app.name} className="h-4 w-4 mr-2" />
                                        ) : (
                                          <div className="w-4 h-4 mr-2 rounded bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs text-primary font-medium">{app.name.charAt(0)}</span>
                                          </div>
                                        )}
                                        <span className="font-medium">{app.name}</span>
                                        {isConnected && (
                                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-sm bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium">
                                            Connected
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {isConnected ? (
                                          <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="text-xs max-w-xs">
                                    <p>{isConnected ? `Manage ${app.name} tools` : app.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })
                        )}
                      </div>
                      
                      <div className="px-1 pt-2 border-t border-border/50 mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                className="text-sm px-3 rounded-lg py-2 mx-0 my-0.5 flex items-center justify-between cursor-pointer hover:bg-accent/50"
                                onClick={handleOpenIntegrationsManager}
                              >
                                <div className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  <span className="font-medium">Discover more apps</span>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-xs max-w-xs">
                              <p>Open full integrations manager</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )}
            </div>
          </div>

        </DropdownMenuContent>
      </DropdownMenu>
      <CustomModelDialog
        isOpen={isCustomModelDialogOpen}
        onClose={closeCustomModelDialog}
        onSave={handleSaveCustomModel}
        initialData={dialogInitialData}
        mode={dialogMode}
      />
      <Dialog open={showIntegrationsManager} onOpenChange={setShowIntegrationsManager}>
        <DialogContent className="p-0 max-w-6xl h-[90vh] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Integrations Manager</DialogTitle>
          </DialogHeader>
          <IntegrationsRegistry
            showAgentSelector={true}
            selectedAgentId={selectedAgentId}
            onClose={() => setShowIntegrationsManager(false)}
          />
        </DialogContent>
      </Dialog>
      {selectedApp && (
        <ComposioConnector
          app={{
            slug: selectedApp.slug,
            name: selectedApp.name,
            description: selectedApp.description,
            categories: ['productivity'],
            tags: [],
            auth_schemes: [],
            logo: selectedAppIcon?.icon_url || ''
          }}
          agentId={selectedAgentId}
          open={showComposioConnector}
          onOpenChange={setShowComposioConnector}
          onComplete={handleComposioComplete}
          mode="full"
        />
      )}
      
    </div>
  );
};

