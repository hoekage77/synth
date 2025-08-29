'use client';

import React from 'react';
import { ModelSelector, ModelSelectorVariant } from '@/components/ui/model-selector';
import { cn } from '@/lib/utils';

interface AgentModelSelectorProps {
  value?: string;
  onChange: (model: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'menu-item';
  className?: string;
}

export function AgentModelSelector({
  value,
  onChange,
  disabled = false,
  variant = 'default',
  className,
}: AgentModelSelectorProps) {
  return (
    <ModelSelector
      value={value}
      onChange={onChange}
      disabled={disabled}
      variant={variant as ModelSelectorVariant}
      className={className}
      placeholder="Choose a model for this agent"
      showAgentIcon={false}
      showRecommendedBadge={true}
      showCustomModelSupport={true}
      showModelDetails={true}
      maxHeight="400px"
    />
  );
}
