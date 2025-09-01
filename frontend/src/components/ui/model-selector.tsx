'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Check, Search, AlertTriangle, Crown, Cpu, Plus, Edit, Trash, KeyRound, ChevronDown, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  useModelSelection, 
  MODELS,
  DEFAULT_FREE_MODEL_ID,
  DEFAULT_PREMIUM_MODEL_ID,
  MODEL_ICONS,
  CustomModel
} from '@/components/thread/chat-input/_use-model-selection';
import { formatModelName } from '@/lib/stores/model-store';
import { useAvailableModels } from '@/hooks/react-query/subscriptions/use-model';
import { isLocalMode } from '@/lib/config';
import { CustomModelDialog, CustomModelFormData } from '@/components/thread/chat-input/custom-model-dialog';
import Link from 'next/link';

export type ModelSelectorVariant = 'default' | 'menu-item' | 'compact' | 'guest';

export interface ModelSelectorProps {
  value?: string;
  onChange: (model: string) => void;
  disabled?: boolean;
  variant?: ModelSelectorVariant;
  className?: string;
  placeholder?: string;
  showAgentIcon?: boolean;
  showRecommendedBadge?: boolean;
  showCustomModelSupport?: boolean;
  showModelDetails?: boolean;
  maxHeight?: string;
}

export function ModelSelector({
  value,
  onChange,
  disabled = false,
  variant = 'default',
  className,
  placeholder = 'Select Model',
  showAgentIcon = false,
  showRecommendedBadge = true,
  showCustomModelSupport = true,
  showModelDetails = true,
  maxHeight = '40vh'
}: ModelSelectorProps) {
  const { 
    allModels, 
    canAccessModel, 
    subscriptionStatus,
    selectedModel: storeSelectedModel,
    customModels: storeCustomModels,
    addCustomModel: storeAddCustomModel,
    updateCustomModel: storeUpdateCustomModel,
    removeCustomModel: storeRemoveCustomModel 
  } = useModelSelection();
  
  const { data: modelsData } = useAvailableModels();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Custom model management state
  const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
  const [dialogInitialData, setDialogInitialData] = useState<CustomModelFormData>({ id: '', label: '' });
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingModelId, setEditingModelId] = useState<string | null>(null);

  const customModels = storeCustomModels;

  // Normalize model ID for consistent handling
  const normalizeModelId = (modelId?: string): string => {
    if (!modelId) return subscriptionStatus === 'active' ? DEFAULT_PREMIUM_MODEL_ID : DEFAULT_FREE_MODEL_ID;
    
    if (modelsData?.models) {
      const exactMatch = modelsData.models.find(m => m.short_name === modelId);
      if (exactMatch) return exactMatch.short_name || exactMatch.id;

      const fullMatch = modelsData.models.find(m => m.id === modelId);
      if (fullMatch) return fullMatch.short_name || fullMatch.id;
      
      if (modelId.startsWith('openrouter/')) {
        const shortName = modelId.replace('openrouter/', '');
        const shortMatch = modelsData.models.find(m => m.short_name === shortName);
        if (shortMatch) return shortMatch.short_name || shortMatch.id;
      }
    }
    
    return modelId;
  };
  
  const normalizedValue = normalizeModelId(value);
  const selectedModel = normalizedValue || storeSelectedModel;

  // Enhanced model options with API data integration
  const enhancedModelOptions = useMemo(() => {
    const modelMap = new Map();

    if (modelsData?.models) {
      modelsData.models.forEach(model => {
        const shortName = model.short_name || model.id;
        const displayName = model.display_name || shortName;
        
        modelMap.set(shortName, {
          id: shortName,
          label: displayName,
          requiresSubscription: false,
          priority: model.priority || 0,
          recommended: model.recommended || false,
          top: (model.priority || 0) >= 90,
          capabilities: model.capabilities || [],
          contextWindow: model.context_window || 128000,
          isCustom: false
        });
      });
    } else {
      allModels.forEach(model => {
        modelMap.set(model.id, {
          ...model,
          isCustom: false
        });
      });
    }

    // Add custom models in local mode
    if (isLocalMode() && showCustomModelSupport) {
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

    return Array.from(modelMap.values());
  }, [modelsData?.models, allModels, customModels, showCustomModelSupport]);
  
  const selectedModelDisplay = useMemo(() => {
    const model = enhancedModelOptions.find(m => m.id === selectedModel);
    return model?.label || selectedModel;
  }, [selectedModel, enhancedModelOptions]);

  // Filtered and sorted models
  const filteredOptions = useMemo(() => {
    return enhancedModelOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enhancedModelOptions, searchQuery]);

  const sortedModels = useMemo(() => {
    return [...filteredOptions].sort((a, b) => {
      if (a.requiresSubscription !== b.requiresSubscription) {
        return a.requiresSubscription ? 1 : -1;
      }
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
  }, [filteredOptions]);

  // Search input focus management
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

  // Model selection handler
  const handleSelect = (modelId: string) => {
    const isCustomModel = customModels.some(model => model.id === modelId);
    
    if (isCustomModel && isLocalMode()) {
      onChange(modelId);
      setIsOpen(false);
      return;
    }
    
    const hasAccess = isLocalMode() || canAccessModel(modelId);
    if (hasAccess) {
      onChange(modelId);
      setIsOpen(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < sortedModels.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : sortedModels.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedModelOption = sortedModels[highlightedIndex];
      if (selectedModelOption) {
        handleSelect(selectedModelOption.id);
      }
    }
  };

  // Custom model dialog handlers (simplified)
  const openAddCustomModelDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDialogInitialData({ id: '', label: '' });
    setDialogMode('add');
    setIsCustomModelDialogOpen(true);
    setIsOpen(false);
  };

  const handleSaveCustomModel = (formData: CustomModelFormData) => {
    const modelId = formData.id.trim();
    const modelLabel = formData.label.trim() || formatModelName(modelId);
    if (!modelId) return;
    
    setIsCustomModelDialogOpen(false);
    const newModel = { id: modelId, label: modelLabel };
    if (dialogMode === 'add') {
      storeAddCustomModel(newModel);
      onChange(modelId);
    }
    setIsOpen(false);
  };

  const handleDeleteCustomModel = (modelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    storeRemoveCustomModel(modelId);
    if (selectedModel === modelId) {
      const defaultModel = subscriptionStatus === 'active' ? DEFAULT_PREMIUM_MODEL_ID : DEFAULT_FREE_MODEL_ID;
      onChange(defaultModel);
    }
  };

  // Render individual model option (simplified)
  const renderModelOption = (model: any, index: number) => {
    const isCustom = Boolean(model.isCustom) || (isLocalMode() && customModels.some(m => m.id === model.id));
    const isHighlighted = index === highlightedIndex;
    const isSelected = selectedModel === model.id;
    const isRecommended = MODELS[model.id]?.recommended || false;
    const showDetailedView = variant === 'default' && showModelDetails;
    
    // Get model provider icon
    const getModelIcon = (modelId: string) => {
      if (modelId.includes('gpt') || modelId.includes('openai')) {
        return '🤖';
      } else if (modelId.includes('claude') || modelId.includes('anthropic')) {
        return '🧠';
      } else if (modelId.includes('gemini') || modelId.includes('google')) {
        return '💎';
      } else if (modelId.includes('moonshot')) {
        return '🌙';
      } else if (modelId.includes('grok') || modelId.includes('xai')) {
        return '⚡';
      } else {
        return '⚙️';
      }
    };

    return (
      <DropdownMenuItem
        key={`model-${model.id}-${index}`}
        className={cn(
          "flex items-center justify-between cursor-pointer transition-all duration-150",
          showDetailedView ? "text-sm px-4 py-3 mx-2 my-1 rounded-xl" : "px-3 py-2 mx-1 my-0.5 rounded-lg text-sm",
          isHighlighted && "bg-accent/50",
          isSelected && (showDetailedView ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20" : "bg-primary/10 text-primary")
        )}
        onClick={() => !disabled && handleSelect(model.id)}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Model icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded border flex items-center justify-center text-xs">
              {getModelIcon(model.id)}
            </div>
          </div>
          
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className={cn("font-medium truncate w-full", isSelected && "text-primary")}>
              {model.label}
            </span>
            {!showDetailedView && model.recommended && showRecommendedBadge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
                Recommended
              </span>
            )}
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-2">
          {isLocalMode() && isCustom && showCustomModelSupport && showDetailedView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCustomModel(model.id, e);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>
          )}
          
          {isSelected && (
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </DropdownMenuItem>
    );
  };

  // Get trigger button styling based on variant
  const getTriggerButton = () => {
    const currentModel = enhancedModelOptions.find(m => m.id === selectedModel);
    const isRecommended = currentModel?.recommended;
    
    // Get model provider icon
    const getModelIcon = (modelId: string) => {
      if (modelId?.includes('gpt') || modelId?.includes('openai')) {
        return '🤖';
      } else if (modelId?.includes('claude') || modelId?.includes('anthropic')) {
        return '🧠';
      } else if (modelId?.includes('gemini') || modelId?.includes('google')) {
        return '💎';
      } else if (modelId?.includes('moonshot')) {
        return '🌙';
      } else if (modelId?.includes('grok') || modelId?.includes('xai')) {
        return '⚡';
      } else {
        return '⚙️';
      }
    };

    switch (variant) {
      case 'menu-item':
        return (
          <div className={cn("flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 mx-0 my-0.5 text-sm hover:bg-accent", disabled && "opacity-50 cursor-not-allowed", className)}>
            <div className="flex items-center gap-2 min-w-0">
              <Cpu className="h-4 w-4" />
              <span className="truncate">{selectedModelDisplay}</span>
            </div>
            <Check className="h-4 w-4 text-blue-500" />
          </div>
        );

      case 'compact':
        return (
          <Button variant="ghost" size="sm" className={cn("h-8 px-2 sm:px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 border border-border/20 hover:border-border/40 rounded-lg font-light text-sm tracking-wide min-w-0 max-w-48 sm:max-w-none", className)} onKeyDown={handleKeyDown}>
            <div className="flex items-center gap-2">
              {showAgentIcon && <Bot className="h-3.5 w-3.5 text-muted-foreground" />}
              <div className="flex items-center justify-center w-4 h-4">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs border">
                  {getModelIcon(selectedModel)}
                </div>
              </div>
              <span className="font-light leading-none truncate">
                <span className="hidden sm:inline">{currentModel?.label || placeholder}</span>
                <span className="sm:hidden">{currentModel?.label?.split(' ')[0] || 'Model'}</span>
              </span>
              {isRecommended && showRecommendedBadge && <Crown className="h-3 w-3 text-amber-500/70 flex-shrink-0" />}
              <ChevronDown className="h-3 w-3 text-muted-foreground/60 transition-transform duration-200 flex-shrink-0" />
            </div>
          </Button>
        );

      case 'guest':
        return (
          <Button variant="outline" size="sm" className={cn("h-9 px-3 border-2 transition-all duration-200 hover:scale-105", isRecommended ? "border-primary/50 bg-primary/5 hover:bg-primary/10" : "border-border hover:border-primary/30", className)} onKeyDown={handleKeyDown}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-4 h-4">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs border">
                  {getModelIcon(selectedModel)}
                </div>
              </div>
              <span className="font-medium text-sm">{currentModel?.label || placeholder}</span>
              {isRecommended && showRecommendedBadge && <Crown className="h-3 w-3 text-yellow-500" />}
              <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200" />
            </div>
          </Button>
        );

      default:
        return (
          <Button variant="outline" size="sm" className={cn("h-8 px-4 py-2", disabled && "opacity-50 cursor-not-allowed", className)}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-4 h-4">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs border">
                  {getModelIcon(selectedModel)}
                </div>
              </div>
              <span className="text-sm">{selectedModelDisplay}</span>
            </div>
          </Button>
        );
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          {getTriggerButton()}
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align={variant === 'menu-item' ? 'end' : 'start'} className={cn("p-0 overflow-hidden border border-border/20", variant === 'default' ? "w-76" : "w-80", variant === 'guest' && "bg-background/95 backdrop-blur-xl shadow-lg")} sideOffset={variant === 'menu-item' ? 8 : 4} onKeyDown={handleKeyDown}>
          <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: maxHeight }}>
            
            {/* Header with search */}
            <div className="p-3 border-b border-border/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {variant === 'guest' ? 'Models' : 'All Models'}
                </span>
                {isLocalMode() && showCustomModelSupport && variant === 'default' && (
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={openAddCustomModelDialog}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Model list */}
            <div className="px-1.5 py-1">
              {sortedModels.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No models found matching "{searchQuery}"
                </div>
              ) : (
                sortedModels.map((model, index) => renderModelOption(model, index))
              )}
            </div>

            {/* Footer for guest variant */}
            {variant === 'guest' && (
              <div className="p-3 border-t border-border bg-muted/30">
                <div className="text-center text-xs text-muted-foreground">
                  <span>{sortedModels.length} free models available</span>
                </div>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Custom model dialog */}
      {isLocalMode() && showCustomModelSupport && (
        <CustomModelDialog
          isOpen={isCustomModelDialogOpen}
          onClose={() => setIsCustomModelDialogOpen(false)}
          onSave={handleSaveCustomModel}
          initialData={dialogInitialData}
          mode={dialogMode}
        />
      )}
    </div>
  );
}