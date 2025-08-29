'use client';

import React from 'react';
import { useAgent } from '@/hooks/react-query/agents/use-agents';
import { XeraLogo } from '@/components/sidebar/kortix-logo';
import { Bot } from 'lucide-react';

interface AgentAvatarProps {
  agentId?: string;
  size?: number;
  className?: string;
  fallbackName?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ 
  agentId, 
  size = 16, 
  className = "", 
  fallbackName = "Agent" 
}) => {
  const { data: agent, isLoading } = useAgent(agentId || '');

  if (isLoading && agentId) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (!agent && !agentId) {
    // Use a generic Bot icon instead of XeraLogo
    return (
      <div className={`flex items-center justify-center rounded ${className}`} style={{ width: size, height: size }}>
        <Bot size={size * 0.8} className="text-muted-foreground" />
      </div>
    );
  }

  const isSuna = agent?.metadata?.is_suna_default;
  if (isSuna) {
    // Use a generic Bot icon instead of XeraLogo for Suna agents
    return (
      <div className={`flex items-center justify-center rounded ${className}`} style={{ width: size, height: size }}>
        <Bot size={size * 0.8} className="text-muted-foreground" />
      </div>
    );
  }

  if (agent?.icon_name) {
    // Use a simple fallback since DynamicIcon is not available
    return (
      <div className={`flex items-center justify-center rounded ${className}`} style={{ width: size, height: size }}>
        <Bot size={size * 0.8} className="text-muted-foreground" />
      </div>
    );
  }

  if (agent?.profile_image_url) {
    return (
      <img 
        src={agent.profile_image_url} 
        alt={agent.name || fallbackName}
        className={`rounded object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Use a generic Bot icon instead of XeraLogo as fallback
  return (
    <div className={`flex items-center justify-center rounded ${className}`} style={{ width: size, height: size }}>
      <Bot size={size * 0.8} className="text-muted-foreground" />
    </div>
  );
};

interface AgentNameProps {
  agentId?: string;
  fallback?: string;
}

export const AgentName: React.FC<AgentNameProps> = ({ 
  agentId, 
  fallback = "Agent" 
}) => {
  const { data: agent, isLoading } = useAgent(agentId || '');

  if (isLoading && agentId) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  return <span>{agent?.name || fallback}</span>;
};