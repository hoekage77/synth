'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoreHorizontal, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { UnifiedMessage } from '../types';
import { ComposioUrlDetector } from './composio-url-detector';
import { renderAttachments } from './ThreadContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClickableUserMessageProps {
  message: UnifiedMessage;
  cleanContent: string;
  attachments: string[];
  onResend: () => void;
  handleOpenFileViewer?: (path: string) => void;
  sandboxId?: string;
  project?: any;
}

export const ClickableUserMessage: React.FC<ClickableUserMessageProps> = ({
  message,
  cleanContent,
  attachments,
  onResend,
  handleOpenFileViewer,
  sandboxId,
  project,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  // Extract the actual text content from the message
  const getMessageText = () => {
    // If cleanContent is already provided, use it (this is the preferred way)
    if (cleanContent) {
      return cleanContent;
    }
    
    // For user messages, the content is usually plain text, not JSON
    // Only try to parse as JSON if it looks like JSON
    if (message.content && message.content.startsWith('{') && message.content.endsWith('}')) {
      try {
        const parsed = JSON.parse(message.content);
        const result = parsed.content || message.content;
        return result;
      } catch {
        // If parsing fails, return the raw content
        return message.content;
      }
    }
    
    // Return the raw content for plain text messages
    return message.content;
  };

  const messageText = getMessageText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      toast.success('Message copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  const handleResend = () => {
    onResend();
    toast.success('Message resent');
  };

  // Desktop long press handlers
  const handleMouseDown = useCallback(() => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsMenuOpen(true);
    }, 500);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    // Only hide hover state if not in long press mode
    if (!isLongPressRef.current) {
      // setIsHovered(false); // Removed hover state
    }
  }, []);

  // Mobile long press handlers
  const handleTouchStart = useCallback(() => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsMenuOpen(true);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="flex max-w-[85%] rounded-3xl rounded-br-lg bg-card border px-4 py-3 overflow-hidden transition-colors duration-200 cursor-pointer relative"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <div className="space-y-3 min-w-0 flex-1">
        {messageText && (
          <div className="whitespace-normal break-normal">
            <ComposioUrlDetector 
              content={messageText} 
              className="text-sm prose prose-sm dark:prose-invert chat-markdown max-w-none [&>:first-child]:mt-0 prose-headings:mt-3 break-normal" 
            />
          </div>
        )}

        {/* Render attachments */}
        {renderAttachments(attachments, handleOpenFileViewer, sandboxId, project)}
      </div>

      {/* Action menu trigger - only show when menu is open */}
      {isMenuOpen && (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48"
            onInteractOutside={() => { 
              setIsMenuOpen(false); 
              isLongPressRef.current = false; 
            }}
          >
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleResend();
                setIsMenuOpen(false);
                isLongPressRef.current = false;
              }}
              className="cursor-pointer"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Resend Message
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleCopy();
                setIsMenuOpen(false);
                isLongPressRef.current = false;
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
