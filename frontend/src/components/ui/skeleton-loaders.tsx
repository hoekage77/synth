'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Base skeleton component
export const Skeleton = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/20', className)}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

// Hero section skeleton
export const HeroSkeleton = React.memo(() => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Title skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-16 w-3/4 mx-auto bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
          <Skeleton className="h-8 w-1/2 mx-auto bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-5/6 mx-auto bg-muted/10" />
          <Skeleton className="h-4 w-4/6 mx-auto bg-muted/10" />
        </div>
        
        {/* Chat input skeleton */}
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-16 w-full bg-black/40 border border-cyan-500/20 rounded-xl" />
        </div>
        
        {/* Examples skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full bg-black/40 border border-cyan-500/10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
});
HeroSkeleton.displayName = 'HeroSkeleton';

// Navigation skeleton
export const NavSkeleton = React.memo(() => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex h-20 items-center justify-between py-4">
          {/* Logo skeleton */}
          <Skeleton className="h-8 w-24 bg-cyan-500/10" />
          
          {/* Navigation menu skeleton */}
          <div className="flex items-center gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16 bg-muted/10" />
            ))}
          </div>
          
          {/* CTA button skeleton */}
          <Skeleton className="h-10 w-32 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg" />
        </div>
      </div>
    </div>
  );
});
NavSkeleton.displayName = 'NavSkeleton';

// Examples grid skeleton
export const ExamplesSkeleton = React.memo(({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-16 w-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full bg-muted/10" />
            <Skeleton className="h-3 w-3/4 bg-muted/10" />
          </div>
        </div>
      ))}
    </div>
  );
});
ExamplesSkeleton.displayName = 'ExamplesSkeleton';

// Chat input skeleton
export const ChatInputSkeleton = React.memo(() => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-black/60 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Input area skeleton */}
          <Skeleton className="flex-1 h-12 bg-black/40 border border-gray-700/50 rounded-lg" />
          
          {/* Voice recorder skeleton */}
          <Skeleton className="w-10 h-10 bg-cyan-500/10 rounded-lg" />
          
          {/* Model selector skeleton */}
          <Skeleton className="w-24 h-8 bg-muted/10 rounded" />
          
          {/* Submit button skeleton */}
          <Skeleton className="w-20 h-8 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded" />
        </div>
      </div>
    </div>
  );
});
ChatInputSkeleton.displayName = 'ChatInputSkeleton';

// Model selector skeleton
export const ModelSelectorSkeleton = React.memo(() => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-3 h-3" />
    </div>
  );
});
ModelSelectorSkeleton.displayName = 'ModelSelectorSkeleton';

// Voice recorder skeleton
export const VoiceRecorderSkeleton = React.memo(() => {
  return (
    <Skeleton className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10" />
  );
});
VoiceRecorderSkeleton.displayName = 'VoiceRecorderSkeleton';

// Flickering grid skeleton
export const FlickeringGridSkeleton = React.memo(() => {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="w-full h-full bg-grid-pattern animate-pulse" />
    </div>
  );
});
FlickeringGridSkeleton.displayName = 'FlickeringGridSkeleton';

// Video section skeleton
export const VideoSkeleton = React.memo(() => {
  return (
    <div className="w-full h-64 md:h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto bg-cyan-500/20" />
        <Skeleton className="h-4 w-32 mx-auto bg-muted/10" />
      </div>
    </div>
  );
});
VideoSkeleton.displayName = 'VideoSkeleton';

// Agent avatar skeleton
export const AgentAvatarSkeleton = React.memo(({ size = 16 }: { size?: number }) => {
  return (
    <Skeleton 
      className={`rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20`}
      style={{ width: size, height: size }}
    />
  );
});
AgentAvatarSkeleton.displayName = 'AgentAvatarSkeleton';