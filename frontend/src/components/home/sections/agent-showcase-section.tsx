'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Bot,
  Brain,
  Eye,
  Target,
  ArrowRight,
  Search,
  Database,
  Monitor,
  Play,
  Terminal,
  Globe,
  FileText,
  Zap,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Interactive Demo Card - Visual-first approach
const DemoCard = ({ 
  title, 
  description,
  icon: Icon,
  demoType,
  isActive,
  onActivate,
  delay = 0
}: {
  title: string;
  description: string;
  icon: any;
  demoType: 'terminal' | 'web' | 'analysis';
  isActive: boolean;
  onActivate: () => void;
  delay?: number;
}) => {
  const getAnimation = () => {
    switch (demoType) {
      case 'terminal':
        return (
          <div className="space-y-3">
            {/* Terminal header */}
            <div className="flex items-center gap-2 text-green-400 text-xs font-mono mb-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-2">xera-terminal</span>
            </div>
            
            {/* Command sequence */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                <span className="text-blue-400">$</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : 0 }}
                  className="overflow-hidden whitespace-nowrap"
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  docker build -t myapp .
                </motion.span>
              </div>
              
              <motion.div 
                className="text-xs text-gray-400 ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 1.8 }}
              >
                Building Docker image...
              </motion.div>
              
              <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                <span className="text-blue-400">$</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : 0 }}
                  className="overflow-hidden whitespace-nowrap"
                  transition={{ duration: 1.2, delay: 2.2 }}
                >
                  kubectl apply -f deployment.yaml
                </motion.span>
              </div>
              
              <motion.div 
                className="flex items-center gap-2 text-cyan-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 3.5 }}
              >
                <CheckCircle className="w-3 h-3" />
                <span>Deployment successful</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 text-green-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 4 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">3 pods running</span>
              </motion.div>
            </div>
          </div>
        );
      case 'web':
        return (
          <div className="relative">
            <div className="w-full h-32 bg-gray-900 rounded border border-gray-700 overflow-hidden">
              {/* Browser header */}
              <div className="bg-gray-800 p-2 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        https://example.com/data
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Browser content */}
              <div className="p-3 text-xs text-gray-300 space-y-2">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 1 }}
                >
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span>Navigating to target page...</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 2 }}
                >
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>Extracting data...</span>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800 rounded p-2 text-green-400 font-mono"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
                  transition={{ delay: 3 }}
                >
                  <div className="text-xs">Found 1,247 records</div>
                  <div className="text-xs">Saved to database ✓</div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-3">
            {/* Analysis header */}
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-400 font-medium">Data Analysis Pipeline</span>
              <motion.span 
                className="text-cyan-400 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 2.5 }}
              >
                {isActive ? '94%' : '0%'}
              </motion.span>
            </div>
            
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Collecting sources</span>
                <motion.div 
                  className="flex-1 h-1 bg-gray-700 rounded overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? '100%' : 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </motion.div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  initial={{ backgroundColor: '#6b7280' }}
                  animate={{ backgroundColor: isActive ? '#22d3ee' : '#6b7280' }}
                  transition={{ delay: 1.3 }}
                ></motion.div>
                <span className="text-xs text-gray-300">Processing data</span>
                <motion.div 
                  className="flex-1 h-1 bg-gray-700 rounded overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? '85%' : 0 }}
                    transition={{ duration: 1.2, delay: 1.3 }}
                  />
                </motion.div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  initial={{ backgroundColor: '#6b7280' }}
                  animate={{ backgroundColor: isActive ? '#a855f7' : '#6b7280' }}
                  transition={{ delay: 2.5 }}
                ></motion.div>
                <span className="text-xs text-gray-300">Generating insights</span>
                <motion.div 
                  className="flex-1 h-1 bg-gray-700 rounded overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? '94%' : 0 }}
                    transition={{ duration: 1.5, delay: 2.5 }}
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Results preview */}
            <motion.div 
              className="bg-gray-800/50 rounded p-3 mt-3 border border-gray-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
              transition={{ delay: 3.5 }}
            >
              <div className="text-xs text-green-400 mb-1">Analysis Complete</div>
              <div className="text-xs text-gray-300">• 247 sources analyzed</div>
              <div className="text-xs text-gray-300">• 15 key insights identified</div>
              <div className="text-xs text-gray-300">• Report generated ✓</div>
            </motion.div>
          </div>
        );
    }
  };

  // Get unique styling for each demo type
  const getCardStyling = () => {
    switch (demoType) {
      case 'terminal':
        return {
          border: isActive ? 'border-green-500/50' : 'border-gray-700/50',
          background: isActive ? 'bg-green-500/5' : 'bg-gray-900/30',
          shadow: isActive ? 'shadow-lg shadow-green-500/10' : '',
          iconBg: isActive ? 'bg-green-500/20' : 'bg-gray-700/50',
          iconColor: isActive ? 'text-green-400' : 'text-gray-400',
          accent: 'text-green-400'
        };
      case 'web':
        return {
          border: isActive ? 'border-blue-500/50' : 'border-gray-700/50',
          background: isActive ? 'bg-blue-500/5' : 'bg-gray-900/30',
          shadow: isActive ? 'shadow-lg shadow-blue-500/10' : '',
          iconBg: isActive ? 'bg-blue-500/20' : 'bg-gray-700/50',
          iconColor: isActive ? 'text-blue-400' : 'text-gray-400',
          accent: 'text-blue-400'
        };
      case 'analysis':
        return {
          border: isActive ? 'border-purple-500/50' : 'border-gray-700/50',
          background: isActive ? 'bg-purple-500/5' : 'bg-gray-900/30',
          shadow: isActive ? 'shadow-lg shadow-purple-500/10' : '',
          iconBg: isActive ? 'bg-purple-500/20' : 'bg-gray-700/50',
          iconColor: isActive ? 'text-purple-400' : 'text-gray-400',
          accent: 'text-purple-400'
        };
      default:
        return {
          border: isActive ? 'border-blue-500/50' : 'border-gray-700/50',
          background: isActive ? 'bg-blue-500/5' : 'bg-gray-900/30',
          shadow: isActive ? 'shadow-lg shadow-blue-500/10' : '',
          iconBg: isActive ? 'bg-blue-500/20' : 'bg-gray-700/50',
          iconColor: isActive ? 'text-blue-400' : 'text-gray-400',
          accent: 'text-blue-400'
        };
    }
  };

  const styling = getCardStyling();

  return (
    <motion.div
      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${styling.border} ${styling.background} ${styling.shadow} hover:border-gray-600/50`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onClick={onActivate}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-2 rounded-lg ${styling.iconBg}`}>
          <Icon className={`w-5 h-5 ${styling.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Interactive demo area */}
      <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
        {getAnimation()}
      </div>
      
      <div className={`flex items-center gap-2 mt-4 text-sm ${styling.accent}`}>
        <Play className="w-3 h-3" />
        <span>Watch demo</span>
      </div>
    </motion.div>
  );
};

// Visual Process Flow
const ProcessFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { icon: Eye, label: 'Observes', color: 'cyan' },
    { icon: Brain, label: 'Plans', color: 'blue' },
    { icon: Target, label: 'Executes', color: 'purple' }
  ];
  
  return (
    <div className="flex items-center justify-center gap-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = activeStep === index;
        const isCompleted = activeStep > index;
        
        return (
          <div key={index} className="flex items-center gap-8">
            <motion.div
              className={`relative flex flex-col items-center cursor-pointer`}
              onClick={() => setActiveStep(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? `border-${step.color}-400 bg-${step.color}-400/10` 
                  : isCompleted
                  ? `border-${step.color}-400/50 bg-${step.color}-400/5`
                  : 'border-gray-600 bg-gray-800'
              }`}>
                <Icon className={`w-6 h-6 transition-colors ${
                  isActive 
                    ? `text-${step.color}-400` 
                    : isCompleted
                    ? `text-${step.color}-400/70`
                    : 'text-gray-400'
                }`} />
              </div>
              <span className={`mt-3 text-sm font-medium transition-colors ${
                isActive 
                  ? `text-${step.color}-400` 
                  : isCompleted
                  ? `text-${step.color}-400/70`
                  : 'text-gray-400'
              }`}>
                {step.label}
              </span>
              
              {/* Pulse effect for active step */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 w-16 h-16 rounded-full border-2 border-${step.color}-400`}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div 
                className={`w-16 h-0.5 transition-colors ${
                  activeStep > index ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export function AgentShowcaseSection() {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const demos = [
    {
      title: "Code & Infrastructure",
      description: "Automate deployments, manage servers, debug issues",
      icon: Terminal,
      type: 'terminal' as const
    },
    {
      title: "Research & Analysis", 
      description: "Gather data, analyze trends, generate insights",
      icon: Search,
      type: 'analysis' as const
    },
    {
      title: "Web Automation",
      description: "Browse sites, extract data, interact with apps", 
      icon: Globe,
      type: 'web' as const
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Minimal background - different from hero */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simplified header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See Xera in action
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Watch how autonomous AI agents handle complex tasks
          </p>
        </motion.div>

        {/* Visual Process Flow */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ProcessFlow />
        </motion.div>

        {/* Interactive Demos - Visual first */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {demos.map((demo, index) => (
            <DemoCard
              key={index}
              title={demo.title}
              description={demo.description}
              icon={demo.icon}
              demoType={demo.type}
              isActive={activeDemo === index}
              onActivate={() => setActiveDemo(activeDemo === index ? null : index)}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Simple CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
          >
            <span>Try Xera</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}