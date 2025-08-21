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
              <SidebarMenuButton className={cn(
                "transition-all duration-300 font-semibold text-sm tracking-wide",
                isDarkMode 
                  ? "text-white hover:text-gray-200 hover:bg-cyan-600/10" 
                  : "text-gray-800 hover:text-gray-900 hover:bg-cyan-600/10"
              )}>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className={cn(
                    "font-semibold text-xs",
                    isDarkMode ? "bg-cyan-600/20 text-white" : "bg-cyan-600/20 text-gray-800"
                  )}>
                    {getInitials(user?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="flex items-center justify-between w-full">
                  {user?.name || 'User'}
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn(
                "w-56 rounded-lg transition-all duration-300",
                isDarkMode
                  ? "bg-black/95 border-cyan-500/30 backdrop-blur-lg"
                  : "bg-white/95 border-cyan-500/30 backdrop-blur-lg"
              )}
              side="right"
              align="start"
            >
              <DropdownMenuLabel className={cn(
                "transition-all duration-300 font-semibold text-xs tracking-wide",
                isDarkMode ? "text-white" : "text-gray-800"
              )}>
                PERSONAL_ACCOUNT
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {defaultTeams.map((team) => (
                  <DropdownMenuItem
                    key={team.account_id}
                    onClick={() => handleTeamSelect(team)}
                    className={cn(
                      "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                      isDarkMode
                        ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                        : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                    )}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                      <AvatarFallback className={cn(
                        "font-semibold text-xs",
                        isDarkMode ? "bg-cyan-600/20 text-white" : "bg-cyan-600/20 text-gray-800"
                      )}>
                        {getInitials(user?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowNewTeamDialog(true)}
                className={cn(
                  "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                  isDarkMode
                    ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                    : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                )}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>CREATE_TEAM</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/settings/billing')}
                className={cn(
                  "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                  isDarkMode
                    ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                    : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                )}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>BILLING</span>
              </DropdownMenuItem>
              {!flagLoading && customAgentsEnabled && (
                <DropdownMenuItem
                  onClick={() => router.push('/settings/api-keys')}
                  className={cn(
                    "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                    isDarkMode
                      ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                      : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                  )}
                >
                  <Key className="mr-2 h-4 w-4" />
                  <span>API_KEYS</span>
                </DropdownMenuItem>
              )}
              {isLocalMode() && (
                <DropdownMenuItem
                  onClick={() => router.push('/settings/env-manager')}
                  className={cn(
                    "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                    isDarkMode
                      ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                      : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                  )}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>LOCAL_ENV_MANAGER</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className={cn(
                  "transition-all duration-300 font-semibold text-xs tracking-wide cursor-pointer",
                  isDarkMode
                    ? "hover:bg-cyan-600/10 text-white hover:text-gray-200"
                    : "hover:bg-cyan-600/10 text-gray-800 hover:text-gray-900"
                )}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>LIGHT_MODE</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>DARK_MODE</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn(
                  'text-destructive focus:text-destructive focus:bg-destructive/10 transition-all duration-300 font-semibold text-xs tracking-wide',
                  isDarkMode 
                    ? "hover:bg-red-600/10 text-red-400 hover:text-red-300" 
                    : "hover:bg-red-600/10 text-red-600 hover:text-red-500"
                )} 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>LOGOUT</span>
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
