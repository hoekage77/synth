'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  Command,
  CreditCard,
  Key,
  LogOut,
  Plus,
  Settings,
  User,
  AudioWaveform,
  Sun,
  Moon,
  KeyRound,
  Plug,
  Sparkles,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { useAccounts } from '@/hooks/use-accounts';
import NewTeamForm from '@/components/basejump/new-team-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import { isLocalMode } from '@/lib/config';
import { clearUserLocalStorage } from '@/lib/utils/clear-local-storage';
import { cn } from '@/lib/utils';
import { BillingModal } from '@/components/billing/billing-modal';

export function NavUserWithTeams({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: accounts } = useAccounts();
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const { theme, systemTheme, setTheme } = useTheme();
  const { enabled: customAgentsEnabled, loading: flagLoading } = useFeatureFlag("custom_agents");
  const [mounted, setMounted] = React.useState(false);

  // After mount, we can access the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  );
  const [showBillingModal, setShowBillingModal] = React.useState(false);

  // Prepare personal account and team accounts
  const personalAccount = React.useMemo(
    () => accounts?.find((account) => account.personal_account),
    [accounts],
  );
  const teamAccounts = React.useMemo(
    () => accounts?.filter((account) => !account.personal_account),
    [accounts],
  );

  // Create a default list of teams with logos for the UI (will show until real data loads)
  const defaultTeams = [
    {
      name: personalAccount?.name || 'Personal Account',
      logo: Command,
      plan: 'Personal',
      account_id: personalAccount?.account_id,
      slug: personalAccount?.slug,
      personal_account: true,
    },
    ...(teamAccounts?.map((team) => ({
      name: team.name,
      logo: AudioWaveform,
      plan: 'Team',
      account_id: team.account_id,
      slug: team.slug,
      personal_account: false,
    })) || []),
  ];

  // Use the first team or first entry in defaultTeams as activeTeam
  const [activeTeam, setActiveTeam] = React.useState(defaultTeams[0]);

  // Update active team when accounts load
  React.useEffect(() => {
    if (accounts?.length) {
      const currentTeam = accounts.find(
        (account) => account.account_id === activeTeam.account_id,
      );
      if (currentTeam) {
        setActiveTeam({
          name: currentTeam.name,
          logo: currentTeam.personal_account ? Command : AudioWaveform,
          plan: currentTeam.personal_account ? 'Personal' : 'Team',
          account_id: currentTeam.account_id,
          slug: currentTeam.slug,
          personal_account: currentTeam.personal_account,
        });
      } else {
        // If current team not found, set first available account as active
        const firstAccount = accounts[0];
        setActiveTeam({
          name: firstAccount.name,
          logo: firstAccount.personal_account ? Command : AudioWaveform,
          plan: firstAccount.personal_account ? 'Personal' : 'Team',
          account_id: firstAccount.account_id,
          slug: firstAccount.slug,
          personal_account: firstAccount.personal_account,
        });
      }
    }
  }, [accounts, activeTeam.account_id]);

  // Handle team selection
  const handleTeamSelect = (team) => {
    setActiveTeam(team);

    // Navigate to the appropriate dashboard
    if (team.personal_account) {
      router.push('/dashboard');
    } else {
      router.push(`/${team.slug}`);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Clear local storage after sign out
    clearUserLocalStorage();
    router.push('/auth');
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      {/* Enhanced Footer Container */}
      <div className="border-t border-border/20 bg-gradient-to-t from-background/80 to-background/40 backdrop-blur-sm">
        {/* Status Indicator */}
        <div className="px-3 py-2 border-b border-border/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500/60 animate-pulse" />
              <span className="font-mono tracking-wide">SYSTEM_ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Activity className="w-3 h-3" />
              <span className="font-mono tracking-wide">XERA_AI</span>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="group w-full transition-all duration-300 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10 rounded-xl mx-0 font-light border border-transparent hover:border-primary/20">
                  <div className="flex items-center w-full p-2">
                    {/* Enhanced Avatar with Glow Effect */}
                    <div className="relative mr-3">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                        <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                        <AvatarFallback className="font-light text-sm bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary-foreground border border-primary/30">
                          {getInitials(user?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      {/* Status indicator dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                    </div>
                    
                    {/* User Info with Enhanced Typography */}
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="font-semibold text-foreground truncate w-full">
                        {user?.name || 'User'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <Sparkles className="w-3 h-3 text-primary/60" />
                        <span className="font-mono tracking-wide truncate">View Profile</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Chevron */}
                    <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground/70 group-hover:text-primary/60 transition-all duration-300 group-hover:rotate-180" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              {/* Enhanced Dropdown Menu */}
              <DropdownMenuContent
                className={cn(
                  "rounded-xl transition-all duration-300 border border-border/30 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/5",
                  isMobile ? "w-80" : "w-72"
                )}
                side={isMobile ? "top" : "right"}
                align={isMobile ? "center" : "start"}
                sideOffset={isMobile ? 8 : 0}
              >
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border/20 rounded-t-xl p-3">
                  <DropdownMenuLabel className="transition-all duration-200 font-semibold text-sm tracking-wide text-foreground px-0 py-0">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary/60" />
                      Account Settings
                    </div>
                  </DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground/70 mt-1 font-light">
                    Manage your Xera AI workspace
                  </p>
                </div>
                
                <DropdownMenuSeparator className="bg-border/20" />
                
                {/* Quick Actions Group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="group">
                    <Link href="/settings/billing" className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200">
                      <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                        <CreditCard className="h-4 w-4 text-primary/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">Billing</span>
                        <span className="text-xs text-muted-foreground/70">Manage subscription</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  
                  {!flagLoading && customAgentsEnabled && (
                    <DropdownMenuItem asChild className="group">
                      <Link href="/settings/credentials" className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200">
                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                          <Plug className="h-4 w-4 text-primary/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">Integrations</span>
                          <span className="text-xs text-muted-foreground/70">Connect services</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {!flagLoading && customAgentsEnabled && (
                    <DropdownMenuItem asChild className="group">
                      <Link href="/settings/api-keys" className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200">
                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                          <Key className="h-4 w-4 text-primary/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">API Keys</span>
                          <span className="text-xs text-muted-foreground/70">Admin access</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="bg-border/20" />
                
                {/* Team Management */}
                <DropdownMenuItem
                  onClick={() => setShowNewTeamDialog(true)}
                  className="group flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                    <Plus className="h-4 w-4 text-primary/60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">Create New Team</span>
                    <span className="text-xs text-muted-foreground/70">Collaborate with others</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border/20" />
                
                {/* Theme Switcher */}
                <DropdownMenuItem
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="group flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 text-primary/60" />
                    ) : (
                      <Moon className="h-4 w-4 text-primary/60" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      Switch to {isDarkMode ? 'light' : 'dark'} theme
                    </span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border/20" />
                
                {/* Settings & Logout */}
                <DropdownMenuItem
                  onClick={() => router.push('/settings')}
                  className="group flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-200">
                    <Settings className="h-4 w-4 text-primary/60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">Settings</span>
                    <span className="text-xs text-muted-foreground/70">Preferences & config</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="group flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-red-500/5 hover:to-red-600/5 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-red-500/20"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-200">
                    <LogOut className="h-4 w-4 text-red-500/60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-red-500/80 group-hover:text-red-500">Sign Out</span>
                    <span className="text-xs text-red-500/60">End session</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Footer Status Bar */}
        <div className="px-3 py-2 border-t border-border/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Zap className="w-3 h-3 text-primary/40" />
              <span className="font-mono tracking-wide">v2.1.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="font-mono tracking-wide">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Dialog Content */}
      <DialogContent className={cn(
        "sm:max-w-md transition-all duration-300",
        isDarkMode 
          ? "bg-black/95 border-primary/30 backdrop-blur-lg" 
          : "bg-white/95 border-primary/30 backdrop-blur-lg"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "font-mono text-lg tracking-wide flex items-center gap-2",
            isDarkMode 
              ? "text-white" 
              : "text-gray-800"
          )}>
            <Sparkles className="w-5 h-5 text-primary/60" />
            CREATE_NEW_TEAM
          </DialogTitle>
          <DialogDescription className={cn(
            "font-mono text-sm tracking-wide",
            isDarkMode 
              ? "text-gray-300" 
              : "text-gray-600"
          )}>
            INITIALIZE_COLLABORATIVE_NEURAL_NETWORK
          </DialogDescription>
        </DialogHeader>
        <NewTeamForm />
      </DialogContent>

      {/* Billing Modal */}
      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
        returnUrl={typeof window !== 'undefined' ? window?.location?.href || '/' : '/'}
      />
    </Dialog>
  );
}
