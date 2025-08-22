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
  Users,
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
import { useFeatureFlag } from '@/lib/feature-flags';
import { cn } from '@/lib/utils';

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
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="transition-all duration-200 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg mx-2 font-light">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className="font-light text-sm bg-muted/30 text-foreground">
                    {getInitials(user?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-foreground">{user?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground/70 font-light">View Profile</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground/70" />
                </span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-lg transition-all duration-200 border border-border/20 bg-background/95 backdrop-blur-xl shadow-lg"
              side="right"
              align="start"
            >
              <DropdownMenuLabel className="transition-all duration-200 font-light text-xs tracking-wide text-muted-foreground/70 px-3 py-2">
                Account Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuGroup>
                {defaultTeams.map((team) => (
                  <DropdownMenuItem
                    key={team.account_id}
                    onClick={() => handleTeamSelect(team)}
                    className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
                  >
                    <Avatar className="h-6 w-6 mr-3">
                      <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                      <AvatarFallback className="font-light text-xs bg-muted/30 text-foreground">
                        {getInitials(user?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{team.name}</span>
                      <span className="text-xs text-muted-foreground/70">Switch Account</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuItem
                onClick={() => setShowNewTeamDialog(true)}
                className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
              >
                <Plus className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Create New Team</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuItem
                onClick={() => router.push('/settings/billing')}
                className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
              >
                <CreditCard className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Billing & Subscription</span>
              </DropdownMenuItem>
              {!flagLoading && customAgentsEnabled && (
                <DropdownMenuItem
                  onClick={() => router.push('/settings/api-keys')}
                  className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
                >
                  <Key className="mr-3 h-4 w-4 text-muted-foreground/70" />
                  <span>API Keys</span>
                </DropdownMenuItem>
              )}
              {isLocalMode() && (
                <DropdownMenuItem
                  onClick={() => router.push('/settings/env-manager')}
                  className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
                >
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground/70" />
                  <span>Environment Manager</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-muted/20 px-3 py-2.5"
              >
                <Settings className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="transition-all duration-200 font-light text-xs tracking-wide cursor-pointer hover:bg-red-500/10 text-red-500/70 hover:text-red-500 px-3 py-2.5"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogContent className={cn(
        "sm:max-w-md transition-all duration-300",
        isDarkMode 
          ? "bg-black/95 border-cyan-500/30 backdrop-blur-lg" 
          : "bg-white/95 border-cyan-500/30 backdrop-blur-lg"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "font-mono text-lg tracking-wide",
            isDarkMode 
              ? "text-white" 
              : "text-gray-800"
          )}>
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
    </Dialog>
  );
}
