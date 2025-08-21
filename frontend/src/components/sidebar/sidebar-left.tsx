'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Menu, Store, Plus, Zap, Plug, ChevronRight, Loader2, Cpu, Power, Terminal, PanelLeft } from 'lucide-react';

import { NavUserWithTeams } from '@/components/sidebar/nav-user-with-teams';
import { NavAgents } from '@/components/sidebar/nav-agents';
import { XeraLogo } from '@/components/sidebar/kortix-logo';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NewAgentDialog } from '@/components/agents/new-agent-dialog';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFeatureFlags } from '@/lib/feature-flags';
import { useTheme } from 'next-themes';
import posthog from 'posthog-js';
import { motion } from 'motion/react';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen } = useSidebar();
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { flags, loading: flagsLoading } = useFeatureFlags(['custom_agents']);
  const customAgentsEnabled = flags.custom_agents;
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  );

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Click outside handler to collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (state === 'expanded') {
          setOpen(false);
        }
      }
    };

    // Only add listener when sidebar is expanded
    if (state === 'expanded') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state, setOpen]);

  const handleNewAgentClick = () => {
    setShowNewAgentDialog(true);
    if (posthog) {
      posthog.capture('new_agent_clicked', { location: 'sidebar' });
    }
  };

  return (
    <Sidebar ref={sidebarRef} className="bg-black border-r border-blue-500/30 scrollbar-hide fixed left-0 top-0 h-full z-50 shadow-2xl">
      <SidebarHeader className="border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            {state === 'collapsed' ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-mono">X</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-white font-mono">XERA</span>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black/60 scrollbar-hide overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-400 font-mono text-xs tracking-wider px-4 py-1">
            System Navigation
          </SidebarGroupLabel>
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === '/agents'}
                className={cn(
                  "transition-all duration-300 text-sm tracking-wide",
                  {
                    'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30': pathname === '/agents',
                    'hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10 text-gray-300 hover:text-blue-400': pathname !== '/agents',
                  }
                )}
              >
                <Link href="/agents">
                  <Bot className="h-4 w-4 mr-2" />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-blue-400 font-mono text-xs tracking-wider px-4 py-1">
            Agent Management
          </SidebarGroupLabel>
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleNewAgentClick}
                className="transition-all duration-300 text-sm tracking-wide text-gray-300 hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Agent</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === '/agents'}
                className={cn(
                  "transition-all duration-300 text-sm tracking-wide",
                  {
                    'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30': pathname === '/agents',
                    'hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10 text-gray-300 hover:text-blue-400': pathname !== '/agents',
                  }
                )}
              >
                <Link href="/agents">
                  <Bot className="h-4 w-4 mr-2" />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {!flagsLoading && customAgentsEnabled && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="text-blue-400 font-mono text-xs tracking-wider px-4 py-1">
              Integrations
            </SidebarGroupLabel>
            
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/settings/credentials'}
                  className={cn(
                    "transition-all duration-300 text-sm tracking-wide",
                    {
                      'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30': pathname === '/settings/credentials',
                      'hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10 text-gray-300 hover:text-blue-400': pathname !== '/settings/credentials',
                    }
                  )}
                >
                  <Link href="/settings/credentials">
                    <Zap className="h-4 w-4 mr-2" />
                    <span>MCP Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        <div className="mt-2">
          <NavAgents />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-blue-500/20 bg-black/80 backdrop-blur-sm scrollbar-hide">
        {state === 'collapsed' && (
          <div className="mt-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className={cn(
                  "h-8 w-8 transition-all duration-300 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20",
                  "border border-blue-500/30 rounded-lg"
                )} />
              </TooltipTrigger>
              <TooltipContent className="bg-black border border-blue-500/30 text-blue-400 font-mono">
                Expand Sidebar (Cmd+B)
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        {user && <NavUserWithTeams user={user} />}
      </SidebarFooter>
      <SidebarRail />
      <NewAgentDialog 
        open={showNewAgentDialog} 
        onOpenChange={setShowNewAgentDialog}
      />
      
      {/* Floating Sidebar Toggle Button - appears when sidebar is hidden */}
      {state === 'collapsed' && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={() => setOpen(true)}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white p-4 rounded-full shadow-2xl shadow-blue-500/25 border-2 border-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-blue-400/50"
          title="Open Sidebar"
        >
          <PanelLeft className="w-6 h-6" />
        </motion.button>
      )}
      
      {/* Mobile Sidebar Toggle Button - always visible on mobile */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white p-3 rounded-full shadow-2xl shadow-blue-500/25 border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 md:hidden"
          title="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      )}
    </Sidebar>
  );
}
