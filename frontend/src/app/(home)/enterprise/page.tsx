'use client';

import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Calendar,
  Sparkles,
  Rocket,
  Terminal,
  Code,
  Cpu,
  Database,
  Server,
  X,
  Send,
  Clock, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Terminal-style text component
const TerminalText = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`font-mono text-green-400 ${className}`}
  >
    {children}
  </motion.div>
);

// Terminal prompt component
const TerminalPrompt = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex items-center gap-2 font-mono text-cyan-400 ${className}`}>
    <span className="text-yellow-400">$</span>
    <span className="text-white">{children}</span>
  </div>
);

// Futuristic Grid Component
const FuturisticGrid = () => (
  <div className="absolute inset-0 opacity-30">
    <div className="h-full w-full" style={{
      backgroundImage: `
        linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px'
    }} />
  </div>
);

// Holographic Orbs Component
const HolographicOrbs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.5, 0.2],
        x: [0, -15, 0],
        y: [0, 15, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
    <motion.div
      className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.4, 1],
        opacity: [0.4, 0.7, 0.4],
        x: [0, 25, 0],
        y: [0, -25, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4
      }}
    />
            </div>
);

// Scanning Lines Component
const ScanningLines = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
      animate={{
        y: [0, window.innerHeight],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div
      className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      animate={{
        y: [0, window.innerHeight],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
        delay: 1.5
      }}
    />
            </div>
);

// Strategy Call Modal Component
const StrategyCallModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    projectDescription: '',
    teamSize: '',
    timeline: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, always succeed
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    // Close modal after 3 seconds
    setTimeout(() => {
      onClose();
      setSubmitStatus('idle');
      setFormData({
        name: '', email: '', company: '', phone: '', preferredDate: '', 
        preferredTime: '', timezone: '', projectDescription: '', teamSize: '', 
        timeline: '', budget: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black border border-green-500/30 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="sticky top-0 bg-black/90 border-b border-green-500/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-mono text-lg">STRATEGY_CALL_SCHEDULER</span>
                </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
                </div>
          <div className="mt-2 text-xs text-gray-400 font-mono">
            <span className="text-green-400">●</span> SYSTEM_READY • SCHEDULING_INITIALIZED
                </div>
              </div>

        {/* Modal Content */}
        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Terminal className="w-8 h-8 text-green-400" />
              </motion.div>
              <TerminalText className="text-2xl mb-2">SCHEDULING_SUCCESSFUL</TerminalText>
              <TerminalText className="text-gray-300">Our team will contact you within 24 hours to confirm your strategy call.</TerminalText>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
                <TerminalText className="text-lg mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  PERSONAL_INFORMATION
                </TerminalText>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">NAME *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">EMAIL *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">COMPANY</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">PHONE</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
            </div>
          </div>
        </div>

              {/* Scheduling Preferences */}
              <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
                <TerminalText className="text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  SCHEDULING_PREFERENCES
                </TerminalText>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">PREFERRED_DATE *</label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                    />
      </div>
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">PREFERRED_TIME *</label>
                    <select
                      required
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                </div>
                <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">TIMEZONE *</label>
                    <select
                      required
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                    >
                      <option value="">Select timezone</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="CST">Central Time (CST)</option>
                      <option value="MST">Mountain Time (MST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="UTC">UTC</option>
                      <option value="GMT">GMT</option>
                    </select>
                </div>
              </div>
            </div>
            
              {/* Project Details */}
              <div className="bg-black/40 border border-green-500/20 rounded-lg p-4">
                <TerminalText className="text-lg mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  PROJECT_DETAILS
                </TerminalText>
                <div className="space-y-4">
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-2">PROJECT_DESCRIPTION *</label>
                    <textarea
                      required
                      value={formData.projectDescription}
                      onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                      rows={4}
                      className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none resize-none"
                      placeholder="Describe your AI project requirements, challenges, and goals..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-green-400 text-sm font-mono mb-2">TEAM_SIZE</label>
                      <select
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange('teamSize', e.target.value)}
                        className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 people</option>
                        <option value="11-50">11-50 people</option>
                        <option value="51-200">51-200 people</option>
                        <option value="200+">200+ people</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-green-400 text-sm font-mono mb-2">TIMELINE</label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      >
                        <option value="">Select timeline</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="12+ months">12+ months</option>
                      </select>
                </div>
                <div>
                      <label className="block text-green-400 text-sm font-mono mb-2">BUDGET_RANGE</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full bg-black/60 border border-green-500/30 rounded px-3 py-2 text-white font-mono focus:border-green-400 focus:outline-none"
                      >
                        <option value="">Select budget</option>
                        <option value="$10k-$50k">$10k - $50k</option>
                        <option value="$50k-$100k">$50k - $100k</option>
                        <option value="$100k-$250k">$100k - $250k</option>
                        <option value="$250k+">$250k+</option>
                      </select>
                </div>
              </div>
            </div>
          </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-2xl shadow-green-500/25 font-mono disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      SCHEDULING_CALL...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      SCHEDULE_STRATEGY_CALL
                    </>
                  )}
                </Button>
        </div>
            </form>
          )}
      </div>
      </motion.div>
    </motion.div>
  );
};

// Hero Section Component
const CustomHeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-black min-h-screen flex items-center justify-center">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-cyan-500/5 to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)]" />
        
        {/* Terminal Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
                  </div>
                </div>
                
      {/* Futuristic Grid Overlay */}
      {mounted && <FuturisticGrid />}
      
      {/* Holographic Orbs */}
      {mounted && <HolographicOrbs />}
      
      {/* Scanning Lines */}
      {mounted && <ScanningLines />}
      
      <div className="relative flex flex-col items-center w-full px-4 sm:px-6">
        <div className="relative z-10 mx-auto h-full w-full max-w-6xl flex flex-col items-center justify-center pt-20 sm:pt-32">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-4xl mx-auto text-center px-2 sm:px-4">
            
            {/* Terminal Status Badge */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-500/10 border border-green-500/30 backdrop-blur-sm font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span className="text-xs sm:text-sm font-medium text-green-400 tracking-wide">ENTERPRISE_TERMINAL_ACTIVE</span>
            </motion.div>
            
            {/* Terminal Command Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-black/80 border border-green-500/30 rounded-lg p-3 sm:p-6 backdrop-blur-sm">
                <TerminalPrompt className="mb-4 text-base sm:text-lg">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="inline-block overflow-hidden whitespace-nowrap"
                  >
                    DEPLOY_ENTERPRISE_AI_WORKFORCE
                  </motion.span>
                </TerminalPrompt>
                
                <TerminalText className="text-sm sm:text-base leading-relaxed">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.6 }}
                    className="inline-block overflow-hidden whitespace-nowrap"
                  >
                    INITIALIZING_AI_AGENTS...<br />
                    LOADING_ENTERPRISE_TOOLS...<br />
                    CONFIGURING_WORKFLOWS...<br />
                    STATUS: READY_FOR_DEPLOYMENT
                  </motion.span>
                </TerminalText>
              </div>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tighter text-balance leading-tight font-mono px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.6 }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ENTERPRISE_AI
                </span>
              </motion.span>
              <br />
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.8 }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  WORKFORCE_DEPLOYED
                </span>
              </motion.span>
            </motion.h1>
            
            {/* Description */}
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <TerminalText className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, delay: 1.0 }}
                  className="inline-block overflow-hidden whitespace-nowrap"
                >
                  DEPLOY_CUSTOM_AI_AGENTS_ACROSS_YOUR_ENTERPRISE.<br />
                  AUTOMATE_COMPLEX_WORKFLOWS.<br />
                  SCALE_OPERATIONS_WITH_INTELLIGENT_AUTOMATION.<br />
                  TRANSFORM_YOUR_BUSINESS_WITH_AI_POWERED_SOLUTIONS.
                </motion.span>
              </TerminalText>
            </motion.div>
            
            {/* Terminal CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg shadow-2xl shadow-green-500/25 font-mono w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                SCHEDULE_STRATEGY_CALL
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg font-mono w-full sm:w-auto">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                VIEW_CASE_STUDIES
              </Button>
            </motion.div>
            
            {/* Terminal Trust Indicators */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 pt-6 sm:pt-8 text-xs sm:text-sm text-gray-400 w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="font-mono">FREE_CONSULTATION</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="font-mono">CUSTOM_SOLUTION_DESIGN</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="font-mono">TAILORED_PRICING</span>
              </div>
            </motion.div>

            {/* Terminal System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-black/60 border border-green-500/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs font-mono text-green-400 mb-2">
                  <span>SYSTEM_STATUS</span>
                  <span className="text-green-400">● ONLINE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>AI_CORES: ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-blue-400" />
                    <span>DB_CONNECTION: STABLE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="w-3 h-3 text-green-400" />
                    <span>CLUSTER: READY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-3 h-3 text-yellow-400" />
                    <span>DEPLOYMENT: PENDING</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Strategy Call Modal */}
      <StrategyCallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

// Main Page Component
export default function CustomImplementationPage() {
  return (
    <main className="w-full bg-black">
        <CustomHeroSection />
    </main>
  );
}
