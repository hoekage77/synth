'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { TourConfirmationDialog } from './TourConfirmationDialog';
import { Sparkles, Zap, Star, X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  highlightElement: (selector: string) => void;
  clearHighlight: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: ReactNode;
  maxSteps?: number;
}

export const TourProvider: React.FC<TourProviderProps> = ({ 
  children, 
  maxSteps = 10 
}) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const tourOverlayRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isTourActive && focusTrapRef.current) {
      focusTrapRef.current.focus();
    }
  }, [isTourActive]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTourActive) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          endTour();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousStep();
          break;
        case 'Enter':
          e.preventDefault();
          nextStep();
          break;
      }
    };

    if (isTourActive) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isTourActive, currentStep]);

  // Highlight element management
  const highlightElement = useCallback((selector: string) => {
    clearHighlight();
    
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('__floater-highlight');
      setHighlightedElement(selector);
      
      // Scroll element into view with offset
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, []);

  const clearHighlight = useCallback(() => {
    if (highlightedElement) {
      const element = document.querySelector(highlightedElement);
      if (element) {
        element.classList.remove('__floater-highlight');
      }
      setHighlightedElement(null);
    }
  }, [highlightedElement]);

  // Tour navigation
  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStep(0);
    setTotalSteps(maxSteps);
  }, [maxSteps]);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
    clearHighlight();
  }, [clearHighlight]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, totalSteps, endTour]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  // Auto-advance tour steps for demo purposes
  useEffect(() => {
    if (isTourActive && currentStep < totalSteps - 1) {
      const timer = setTimeout(() => {
        // Only auto-advance if user hasn't interacted
        const hasUserInteraction = document.querySelector(':focus');
        if (!hasUserInteraction) {
          nextStep();
        }
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [isTourActive, currentStep, totalSteps, nextStep]);

  const contextValue: TourContextType = {
    isTourActive,
    currentStep,
    totalSteps,
    startTour,
    endTour,
    nextStep,
    previousStep,
    goToStep,
    highlightElement,
    clearHighlight,
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      
      {/* Tour Overlay */}
      {isTourActive && (
        <>
          {/* Focus trap for accessibility */}
          <div
            ref={focusTrapRef}
            tabIndex={-1}
            className="__floater-focus-trap"
            aria-label="Tour focus trap"
          />
          
          {/* Tour overlay */}
          <div
            ref={tourOverlayRef}
            className="fixed inset-0 z-[9999] pointer-events-none"
            aria-hidden="true"
          >
            {/* Tour controls */}
            <div className="absolute top-4 right-4 z-[10000] pointer-events-auto">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
                {/* Progress indicator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm font-medium">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                  </div>
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent text-white hover:from-cyan-600 hover:to-blue-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={endTour}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={endTour}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tour step indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-auto">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-2xl">
                <div className="flex items-center gap-4">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        index === currentStep
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 scale-125"
                          : index < currentStep
                          ? "bg-green-400"
                          : "bg-white/30 hover:bg-white/50"
                      )}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TourContext.Provider>
  );
};
