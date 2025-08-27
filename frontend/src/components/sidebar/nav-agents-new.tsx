'use client';

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
import { ThreadWithProject, GroupedThreads } from '@/hooks/react-query/sidebar/use-sidebar';
import { processThreadsWithProjects, useDeleteMultipleThreads, useDeleteThread, useProjects, useThreads, groupThreadsByDate } from '@/hooks/react-query/sidebar/use-sidebar';
import { projectKeys, threadKeys } from '@/hooks/react-query/sidebar/keys';

// Component for date group headers
const DateGroupHeader: React.FC<{ dateGroup: string; count: number }> = ({ dateGroup, count }) => {
  return (
    <div className="px-2 py-1 mb-1 mt-3 first:mt-0">
      <div className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
        {dateGroup} ({count})
      </div>
    </div>
  );
};

// Component for individual thread item
const ThreadItem: React.FC<{
  thread: ThreadWithProject;
  isActive: boolean;
  isThreadLoading: boolean;
  isSelected: boolean;
  selectedThreads: Set<string>;
  loadingThreadId: string | null;
  pathname: string | null;
  isMobile: boolean;
  handleThreadClick: (e: React.MouseEvent<HTMLAnchorElement>, threadId: string, url: string) => void;
  toggleThreadSelection: (threadId: string, e?: React.MouseEvent) => void;
  handleDeleteThread: (threadId: string, threadName: string) => void;
  setSelectedItem: (item: { threadId: string; projectId: string } | null) => void;
  setShowShareModal: (show: boolean) => void;
}> = ({ 
  thread, 
  isActive, 
  isThreadLoading, 
  isSelected, 
  handleThreadClick, 
  toggleThreadSelection, 
  handleDeleteThread, 
  setSelectedItem, 
  setShowShareModal,
  isMobile 
}) => {
  return (
    <SidebarMenuItem key={`thread-${thread.threadId}`} className="group/row">
      <SidebarMenuButton
        asChild
        className={`relative ${
          isActive
            ? 'bg-accent text-accent-foreground font-medium'
            : isSelected
              ? 'bg-primary/10'
              : ''
        }`}
      >
        <div className="flex items-center w-full">
          <Link
            href={thread.url}
            onClick={(e) =>
              handleThreadClick(e, thread.threadId, thread.url)
            }
            prefetch={false}
            className="flex items-center flex-1 min-w-0 touch-manipulation"
          >
            {isThreadLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2 flex-shrink-0" />
            ) : null}
            <span className="truncate">{thread.projectName}</span>
          </Link>
          
          {/* Checkbox - only visible on hover of this specific area */}
          <div
            className="mr-1 flex-shrink-0 w-4 h-4 flex items-center justify-center group/checkbox"
            onClick={(e) => toggleThreadSelection(thread.threadId, e)}
          >
            <div
              className={`h-4 w-4 border rounded cursor-pointer transition-all duration-150 flex items-center justify-center ${
                isSelected
                  ? 'opacity-100 bg-primary border-primary hover:bg-primary/90'
                  : 'opacity-0 group-hover/checkbox:opacity-100 border-muted-foreground/30 bg-background hover:bg-muted/50'
              }`}
            >
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
          </div>

          {/* Dropdown Menu - inline with content */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="cursor-pointer flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-muted/50 rounded transition-all duration-150 text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100"
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
              className="w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align={isMobile ? 'end' : 'start'}
            >
              <DropdownMenuItem onClick={() => {
                setSelectedItem({ threadId: thread?.threadId, projectId: thread?.projectId })
                setShowShareModal(true)
              }}>
                <Share2 className="text-muted-foreground" />
                <span>Share Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={thread.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
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
              >
                <Trash2 className="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};