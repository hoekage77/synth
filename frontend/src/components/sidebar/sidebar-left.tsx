'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Menu, Store, Plus, Zap, Plug, ChevronRight, Loader2, Cpu, Power, Terminal, PanelLeft, Network } from 'lucide-react';

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
import { NewAgentDialog } from '@/components/agents/new-agent-dialog';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import posthog from 'posthog-js';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen } = useSidebar();
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { flags, loading: flagsLoading } = useFeatureFlags(['custom_agents']);
  const customAgentsEnabled = flags.custom_agents;
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // After mount, we can access the theme and ensure mobile detection is working
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  );

  useEffect(() => {
    const supabase = createClient();
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
    <Sidebar ref={sidebarRef} className="bg-background/95 backdrop-blur-xl border-r border-border/20 scrollbar-hide fixed left-0 top-0 h-full z-50 shadow-lg">
      <SidebarHeader className="border-b border-border/20 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-foreground to-foreground/80 rounded-lg flex items-center justify-center">
              <span className="text-background font-semibold text-sm">X</span>
            </div>
            {state !== 'collapsed' && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Xera</span>
                <span className="text-xs text-muted-foreground/70 font-light">AI Platform</span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background/95 backdrop-blur-xl scrollbar-hide overflow-y-auto border-r border-border/20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 font-light text-xs tracking-wide px-4 py-2">
            Quick Actions
          </SidebarGroupLabel>
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => router.push('/dashboard')}
                className="transition-all duration-200 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg mx-2 font-light"
              >
                <Plus className="h-4 w-4 mr-2 text-muted-foreground/70" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleNewAgentClick}
                className="transition-all duration-200 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg mx-2 font-light"
              >
                <Plus className="h-4 w-4 mr-2 text-muted-foreground/70" />
                <span>Create Agent</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 font-light text-xs tracking-wide px-4 py-2">
            Agent Management
          </SidebarGroupLabel>
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === '/agents'}
                className={cn(
                  "transition-all duration-200 text-sm tracking-wide rounded-lg mx-2",
                  {
                    'bg-muted/30 text-foreground': pathname === '/agents',
                    'text-muted-foreground hover:text-foreground hover:bg-muted/20': pathname !== '/agents',
                  },
                  "font-light"
                )}
              >
                <Link href="/agents">
                  <Bot className="h-4 w-4 mr-2 text-muted-foreground/70" />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {!flagsLoading && customAgentsEnabled && (
          <SidebarGroup className="mt-0.5">
            <SidebarGroupLabel className="text-muted-foreground/70 font-light text-xs tracking-wide px-4 py-2">
              Integrations
            </SidebarGroupLabel>
            
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/agents/mcp'}
                  className={cn(
                    "transition-all duration-200 text-sm tracking-wide rounded-lg mx-2",
                    {
                      'bg-muted/30 text-foreground': pathname === '/agents/mcp',
                      'text-muted-foreground hover:text-foreground hover:bg-muted/20': pathname !== '/agents/mcp',
                    },
                    "font-light"
                  )}
                >
                  <Link href="/agents/mcp">
                    <Network className="h-4 w-4 mr-2 text-muted-foreground/70" />
                    <span>MCP Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-0.5">
          <SidebarGroupLabel className="text-muted-foreground/70 font-light text-xs tracking-wide px-4 py-2">
            Message History
          </SidebarGroupLabel>
          
          <NavAgents />
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/20 bg-background/95 backdrop-blur-xl">
        {state === 'collapsed' && (
          <div className="mt-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className={cn(
                  "h-8 w-8 transition-all duration-200 text-muted-foreground/70 hover:text-foreground hover:bg-muted/20",
                  "border border-border/30 rounded-lg"
                )} />
              </TooltipTrigger>
              <TooltipContent className="bg-background/95 border border-border/20 text-foreground font-light">
                Expand Sidebar (Cmd+B)
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {state !== 'collapsed' && user && (
          <div className="p-4">
            <NavUserWithTeams user={{ 
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User', 
              email: user.email || 'user@example.com', 
              avatar: user.user_metadata?.avatar_url || '' 
            }} />
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
      <NewAgentDialog 
        open={showNewAgentDialog} 
        onOpenChange={setShowNewAgentDialog}
      />
      
      {/* Desktop Floating Sidebar Toggle Button - appears when sidebar is collapsed */}
      {!isMobile && state === 'collapsed' && (
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
      {isMobile && mounted && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white p-3 rounded-full shadow-2xl shadow-blue-500/25 border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 md:hidden lg:hidden xl:hidden 2xl:hidden"
          title="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      )}
    </Sidebar>
  );
}
