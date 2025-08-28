'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { XeraLogo } from '../sidebar/kortix-logo';
import { AlertDialog, AlertDialogContent, AlertDialogHeader } from '../ui/alert-dialog';
import { AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { Sparkles, Play, X } from 'lucide-react';

interface TourConfirmationDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const TourConfirmationDialog = React.memo(({ open, onAccept, onDecline }: TourConfirmationDialogProps) => {
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      onDecline();
    }
  }, [onDecline]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg w-[90vw] p-0 overflow-hidden [&>button]:hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative p-8 pb-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 border-b border-white/10">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-75" />
            <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-150" />
            
            {/* Logo container with enhanced styling */}
            <div className='h-32 w-full rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden'>
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              
              <div className="relative z-10">
                <XeraLogo size={60} />
              </div>
              
              {/* Floating sparkles */}
              <div className="absolute top-4 left-4">
                <Sparkles className="h-4 w-4 text-blue-400 animate-bounce" />
              </div>
              <div className="absolute bottom-4 right-4">
                <Sparkles className="h-4 w-4 text-purple-400 animate-bounce delay-300" />
              </div>
            </div>
            
            {/* Welcome text with enhanced typography */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1">
                <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Welcome to Xera
                </AlertDialogTitle>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2" />
              </div>
            </div>
            
            <AlertDialogDescription className="text-white/80 text-base leading-relaxed mt-4">
              Would you like a quick guided tour to help you get started? We'll show you the key features and how to make the most of Xera.
            </AlertDialogDescription>
          </div>
          
          {/* Action buttons with enhanced styling */}
          <div className="flex items-center gap-4 p-8 pt-6">
            <Button
              variant="outline"
              onClick={onDecline}
              className="flex-1 h-12 bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-200 rounded-xl font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Skip Tour
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-medium"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Tour
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
});

TourConfirmationDialog.displayName = 'TourConfirmationDialog'; 