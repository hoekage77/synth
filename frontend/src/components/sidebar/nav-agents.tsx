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
  History
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
      <SidebarGroupLabel className={cn(
        "px-2 py-1.5 text-xs font-semibold tracking-wide",
        isDarkMode ? "text-white/70" : "text-gray-600/70",
        state === 'collapsed' && "sr-only"
      )}>
        Message History
      </SidebarGroupLabel>
      <SidebarMenu>
        {combinedThreads.length > 0 && (
          <>
            {/* Multi-select controls */}
            {selectedThreads.size > 0 && (
              <div className="px-2 py-1.5 space-y-1">
                {state !== 'collapsed' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(
                        "font-semibold tracking-wide",
                        isDarkMode ? "text-white/70" : "text-gray-600/70"
                      )}>
                        Selected: {selectedThreads.size}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={handleSelectAll}
                          className={cn(
                            "px-2 py-1 rounded text-xs font-semibold tracking-wide transition-all duration-300",
                            isDarkMode
                              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30"
                              : "bg-blue-600/20 text-blue-600 hover:bg-blue-600/30 border border-blue-500/30"
                          )}
                        >
                          Select All
                        </button>
                        <button
                          onClick={handleClearSelection}
                          className={cn(
                            "px-2 py-1 rounded text-xs font-semibold tracking-wide transition-all duration-300",
                            isDarkMode
                              ? "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 border border-gray-500/30"
                              : "bg-gray-600/20 text-gray-600 hover:bg-gray-600/30 border border-gray-500/30"
                          )}
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleDeleteSelected}
                          disabled={selectedThreads.size === 0}
                          className={cn(
                            "px-2 py-1 rounded text-xs font-semibold tracking-wide transition-all duration-300",
                            isDarkMode
                              ? "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 disabled:opacity-50"
                              : "bg-red-600/20 text-red-600 hover:bg-red-600/30 border border-red-500/30 disabled:opacity-50"
                          )}
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                    {isDeletingSingle || isDeletingMultiple ? (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${deleteProgress}%` }}></div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            )}

            {combinedThreads.map((thread) => {
              // Check if this thread is currently active
              const isActive = pathname?.includes(thread.threadId) || false;
              const isThreadLoading = loadingThreadId === thread.threadId;
              const isSelected = selectedThreads.has(thread.threadId);

              return (
                <SidebarMenuItem key={`thread-${thread.threadId}`} className="group/row">
                  <div className="relative transition-all duration-300 font-semibold text-xs tracking-wide flex items-center w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={thread.url}
                          onClick={(e) => handleThreadClick(e, thread.threadId, thread.url)}
                          className={cn(
                            "flex-1 flex items-center px-2 py-1.5 rounded transition-all duration-300",
                            {
                              'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30': isActive,
                              'bg-primary/10': isSelected && !isActive,
                            },
                            isDarkMode
                              ? "text-white hover:text-gray-200 hover:bg-blue-600/10"
                              : "text-gray-800 hover:text-gray-900 hover:bg-blue-600/10"
                          )}
                        >
                          {isThreadLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2 flex-shrink-0" />
                          ) : null}
                          {state !== 'collapsed' && (
                            <span className="truncate font-semibold tracking-wide">{thread.projectName}</span>
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
                            ? 'opacity-100 bg-blue-600 border-blue-500 hover:bg-blue-500'
                            : 'opacity-0 group-hover/checkbox:opacity-100 border-blue-500/30 bg-transparent hover:bg-blue-600/10'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>

                    {/* Dropdown Menu - inline with content */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-all duration-150 opacity-0 group-hover/row:opacity-100",
                            isDarkMode 
                              ? "hover:bg-blue-600/20 text-white hover:text-gray-200" 
                              : "hover:bg-blue-600/20 text-gray-800 hover:text-gray-900"
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
                        className={cn(
                          "w-56 rounded-lg transition-all duration-300",
                          isDarkMode 
                            ? "bg-black/95 border-blue-500/30 backdrop-blur-lg" 
                            : "bg-white/95 border-blue-500/30 backdrop-blur-lg"
                        )}
                        side={isMobile ? 'bottom' : 'right'}
                        align={isMobile ? 'end' : 'start'}
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem({ threadId: thread?.threadId, projectId: thread?.projectId })
                            setShowShareModal(true)
                          }}
                          className={cn(
                            "transition-all duration-300 font-semibold text-xs tracking-wide",
                            isDarkMode
                              ? "hover:bg-blue-600/10 text-white hover:text-gray-200"
                              : "hover:bg-blue-600/10 text-gray-800 hover:text-gray-900"
                          )}
                        >
                          <Share2 className="text-muted-foreground" />
                          <span>Share Chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={thread.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "transition-all duration-300 font-semibold text-xs tracking-wide",
                              isDarkMode
                                ? "hover:bg-blue-600/10 text-white hover:text-gray-200"
                                : "hover:bg-blue-600/10 text-gray-800 hover:text-gray-900"
                            )}
                          >
                            <ArrowUpRight className="text-muted-foreground" />
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
                          className={cn(
                            "transition-all duration-300 font-semibold text-xs tracking-wide",
                            isDarkMode
                              ? "hover:bg-red-600/10 text-red-400 hover:text-red-300"
                              : "hover:bg-red-600/10 text-red-600 hover:text-red-500"
                          )}
                        >
                          <Trash2 className="text-muted-foreground" />
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
            "px-2 py-4 text-center font-semibold text-xs tracking-wide",
            isDarkMode ? "text-white/70" : "text-gray-600/70"
          )}>
            No Tasks Yet
          </div>
        )}
      </SidebarMenu>

      {(isDeletingSingle || isDeletingMultiple) && totalToDelete > 0 && (
        <div className="mt-2 px-2">
          <div className={cn(
            "text-xs mb-1 font-mono tracking-wide",
            isDarkMode ? "text-blue-300/70" : "text-blue-600/70"
          )}>
            Deleting {deleteProgress > 0 ? `(${Math.floor(deleteProgress)}%)` : '...'}
          </div>
          <div className={cn(
            "w-full h-1 rounded-full overflow-hidden",
            isDarkMode ? "bg-blue-600/20" : "bg-blue-400/20"
          )}>
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 transition-all duration-300 ease-in-out"
              style={{ width: `${deleteProgress}%` }}
            />
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