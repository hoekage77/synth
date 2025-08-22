'use client';

// NavAgents component for sidebar navigation
import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  MessagesSquare,
  Loader2,
  Share2,
  X,
  Check,
  History,
  Plus,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import Link from "next/link"
import { ShareModal } from "./share-modal"
import { DeleteConfirmationDialog } from "@/components/thread/DeleteConfirmationDialog"
import { useDeleteOperation } from '@/contexts/DeleteOperationContext'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ThreadWithProject } from '@/hooks/react-query/sidebar/use-sidebar';
import { processThreadsWithProjects, useDeleteMultipleThreads, useDeleteThread, useProjects, useThreads } from '@/hooks/react-query/sidebar/use-sidebar';
import { projectKeys, threadKeys } from '@/hooks/react-query/sidebar/keys';
import { cn } from '@/lib/utils';

export function NavAgents() {
  const { isMobile, state } = useSidebar()
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loadingThreadId, setLoadingThreadId] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ threadId: string, projectId: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null)
  const isNavigatingRef = useRef(false)
  const { performDelete } = useDeleteOperation();
  const isPerformingActionRef = useRef(false);
  const queryClient = useQueryClient();

  const [selectedThreads, setSelectedThreads] = useState<Set<string>>(new Set());
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [totalToDelete, setTotalToDelete] = useState(0);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  );

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    error: projectsError
  } = useProjects();

  const {
    data: threads = [],
    isLoading: isThreadsLoading,
    error: threadsError
  } = useThreads();

  const { mutate: deleteThreadMutation, isPending: isDeletingSingle } = useDeleteThread();
  const {
    mutate: deleteMultipleThreadsMutation,
    isPending: isDeletingMultiple
  } = useDeleteMultipleThreads();

  const combinedThreads: ThreadWithProject[] =
    !isProjectsLoading && !isThreadsLoading ?
      processThreadsWithProjects(threads, projects) : [];

  const handleDeletionProgress = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    setDeleteProgress(percentage);
  };

  useEffect(() => {
    const handleProjectUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { projectId, updatedData } = customEvent.detail;
        queryClient.invalidateQueries({ queryKey: projectKeys.details(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    };

    window.addEventListener('project-updated', handleProjectUpdate as EventListener);
    return () => {
      window.removeEventListener(
        'project-updated',
        handleProjectUpdate as EventListener,
      );
    };
  }, [queryClient]);

  useEffect(() => {
    setLoadingThreadId(null);
  }, [pathname]);

  useEffect(() => {
    const handleNavigationComplete = () => {
      document.body.style.pointerEvents = 'auto';
      isNavigatingRef.current = false;
    };

    window.addEventListener("popstate", handleNavigationComplete);

    return () => {
      window.removeEventListener('popstate', handleNavigationComplete);
      // Ensure we clean up any leftover styles
      document.body.style.pointerEvents = "auto";
    };
  }, []);

  // Reset isNavigatingRef when pathname changes
  useEffect(() => {
    isNavigatingRef.current = false;
    document.body.style.pointerEvents = 'auto';
  }, [pathname]);

  // Function to handle thread click with loading state
  const handleThreadClick = (e: React.MouseEvent<HTMLAnchorElement>, threadId: string, url: string) => {
    // If thread is selected, prevent navigation 
    if (selectedThreads.has(threadId)) {
      e.preventDefault();
      return;
    }

    e.preventDefault()
    setLoadingThreadId(threadId)
    router.push(url)
  }

  // Toggle thread selection for multi-select
  const toggleThreadSelection = (threadId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  // Handle delete thread
  const handleDeleteThread = (threadId: string, threadName: string) => {
    setThreadToDelete({ id: threadId, name: threadName });
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!threadToDelete) return;

    if (selectedThreads.size > 0) {
      // Delete multiple threads
      const threadIds = Array.from(selectedThreads);
      setTotalToDelete(threadIds.length);
      
      deleteMultipleThreadsMutation(
        { threadIds },
        {
          onSuccess: () => {
            setSelectedThreads(new Set());
            setDeleteProgress(0);
            setTotalToDelete(0);
            toast.success(`Deleted ${threadIds.length} thread${threadIds.length > 1 ? 's' : ''}`);
          },
          onError: (error) => {
            toast.error('Failed to delete threads');
            console.error('Delete error:', error);
          },
          onSettled: () => {
            setDeleteProgress(0);
            setTotalToDelete(0);
          }
        }
      );
    } else {
      // Delete single thread
      deleteThreadMutation(
        { threadId: threadToDelete.id },
        {
          onSuccess: () => {
            toast.success('Thread deleted successfully');
          },
          onError: (error) => {
            toast.error('Failed to delete thread');
            console.error('Delete error:', error);
          }
        }
      );
    }

    setIsDeleteDialogOpen(false);
    setThreadToDelete(null);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedThreads(new Set());
  };

  // Select all threads
  const selectAllThreads = () => {
    const allThreadIds = combinedThreads.map(thread => thread.threadId);
    setSelectedThreads(new Set(allThreadIds));
  };

  const handleSelectAll = () => {
    selectAllThreads();
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleDeleteSelected = () => {
    const threadNames = Array.from(selectedThreads).map(threadId => {
      const thread = combinedThreads.find(t => t.threadId === threadId);
      return thread?.projectName || 'Unknown';
    });
    setThreadToDelete({ 
      id: Array.from(selectedThreads).join(','), 
      name: threadNames.join(', ') 
    });
    setIsDeleteDialogOpen(true);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {combinedThreads.length > 0 && (
          <>
            {/* Multi-select controls */}
            {selectedThreads.size > 0 && (
              <div className="px-2 py-2 space-y-2">
                {state !== 'collapsed' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSelectAll}
                      className="h-6 px-2 text-xs text-muted-foreground/70 hover:text-foreground hover:bg-muted/20 font-light"
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleClearSelection}
                      className="h-6 px-2 text-xs text-muted-foreground/70 hover:text-foreground hover:bg-muted/20 font-light"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteSelected}
                      className="h-6 px-2 text-xs text-red-500/70 hover:text-red-500 hover:bg-red-500/10 font-light"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Thread items */}
            {combinedThreads.map((thread) => {
              // Check if this thread is currently active
              const isActive = pathname?.includes(thread.threadId) || false;
              const isThreadLoading = loadingThreadId === thread.threadId;
              const isSelected = selectedThreads.has(thread.threadId);

              return (
                <SidebarMenuItem key={`thread-${thread.threadId}`} className="group/row">
                  <div className="relative transition-all duration-200 font-light text-xs tracking-wide flex items-center w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={thread.url}
                          onClick={(e) => handleThreadClick(e, thread.threadId, thread.url)}
                          className={cn(
                            "flex-1 flex items-center px-3 py-2 rounded-lg transition-all duration-200 mx-2",
                            {
                              'bg-muted/30 text-foreground': isActive,
                              'bg-muted/20': isSelected && !isActive,
                              'text-muted-foreground hover:text-foreground hover:bg-muted/20': !isActive && !isSelected,
                            }
                          )}
                        >
                          {isThreadLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2 flex-shrink-0 text-muted-foreground/70" />
                          ) : (
                            <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground/70 flex-shrink-0" />
                          )}
                          {state !== 'collapsed' && (
                            <span className="truncate font-light">{thread.projectName}</span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        {thread.projectName}
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Checkbox - only visible on hover of this specific area */}
                    <div
                      className="mr-1 flex-shrink-0 w-4 h-4 flex items-center justify-center group/checkbox"
                      onClick={(e) => toggleThreadSelection(thread.threadId, e)}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 border rounded cursor-pointer transition-all duration-150 flex items-center justify-center",
                          isSelected
                            ? 'opacity-100 bg-foreground border-foreground hover:bg-foreground/90'
                            : 'opacity-0 group-hover/checkbox:opacity-100 border-border/50 bg-transparent hover:bg-muted/20'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-background" />}
                      </div>
                    </div>

                    {/* Dropdown Menu - inline with content */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-all duration-200 opacity-0 group-hover/row:opacity-100",
                            "hover:bg-muted/20 text-muted-foreground/70 hover:text-foreground"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Ensure pointer events are enabled when dropdown opens
                            document.body.style.pointerEvents = 'auto';
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 rounded-lg transition-all duration-200 border border-border/20 bg-background/95 backdrop-blur-xl shadow-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align={isMobile ? 'end' : 'start'}
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem({ threadId: thread?.threadId, projectId: thread?.projectId })
                            setShowShareModal(true)
                          }}
                          className="transition-all duration-200 font-light text-xs tracking-wide hover:bg-muted/20"
                        >
                          <Share2 className="text-muted-foreground/70 mr-2 h-4 w-4" />
                          <span>Share Chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={thread.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-200 font-light text-xs tracking-wide hover:bg-muted/20"
                          >
                            <ArrowUpRight className="text-muted-foreground/70 mr-2 h-4 w-4" />
                            <span>Open New Tab</span>
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteThread(
                              thread.threadId,
                              thread.projectName,
                            )
                          }
                          className="transition-all duration-200 font-light text-xs tracking-wide hover:bg-red-500/10 text-red-500/70 hover:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              );
            })}
          </>
        ) || (
          <div className={cn(
            "px-4 py-4 text-center font-light text-xs tracking-wide text-muted-foreground/70",
          )}>
            No Tasks Yet
          </div>
        )}
      </SidebarMenu>

      {/* Delete Progress */}
      {(isDeletingSingle || isDeletingMultiple) && totalToDelete > 0 && (
        <div className="mt-1 px-4">
          <div className={cn(
            "text-xs mb-2 font-light tracking-wide text-muted-foreground/70",
          )}>
            Deleting {deleteProgress > 0 ? `(${Math.floor(deleteProgress)}%)` : '...'}
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1">
            <div className="bg-foreground/70 h-1 rounded-full transition-all duration-200" style={{ width: `${deleteProgress}%` }}></div>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        threadId={selectedItem?.threadId}
        projectId={selectedItem?.projectId}
      />

      {threadToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          threadName={threadToDelete.name}
          isDeleting={isDeletingSingle || isDeletingMultiple}
        />
      )}
    </SidebarGroup>
  );
}