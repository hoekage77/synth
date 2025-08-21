'use client';

import { motion } from 'motion/react';
import { 
  Zap, 
  Globe, 
  Workflow,
  Database, 
  Terminal, 
  Shield,
  Bot,
  Cpu,
  Brain
} from 'lucide-react';
import Link from 'next/link';

// Clean Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  visualElement,
  stats
}: {
  icon: any;
  title: string;
  description: string;
  visualElement: React.ReactNode;
  stats?: string;
}) => {
  return (
    <motion.div
      className="group relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl hover:border-slate-600/70 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Visual Element */}
      <div className="mb-4 flex justify-center">
        {visualElement}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-center leading-relaxed mb-3 text-sm">
        {description}
      </p>

      {/* Stats if provided */}
      {stats && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-600/30">
            <Icon className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">{stats}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export function AgentShowcaseSection() {
  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            AI Agent Capabilities
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the powerful features that make our AI agents the most advanced automation platform available
          </p>
        </motion.div>

        {/* Three Main Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: AI Agent Building */}
          <FeatureCard
            icon={Bot}
            title="AI Agent Builder"
            description="Build AI agents using natural language. Simply describe what you want your agent to do, and our advanced NLP system creates a fully functional AI agent tailored to your needs."
            stats="NLP Powered"
            visualElement={
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
            }
          />

          {/* Card 2: Advanced Integrations */}
          <FeatureCard
            icon={Globe}
            title="Advanced Integrations"
            description="Connect to 500+ tools and services. From web scraping and API integrations to database operations and cloud services, our agents can handle any integration you need."
            stats="500+ Tools"
            visualElement={
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30 flex items-center justify-center">
                <Globe className="w-8 h-8 text-green-400" />
              </div>
            }
          />

          {/* Card 3: Full Operating System Access */}
          <FeatureCard
            icon={Terminal}
            title="Full Operating System Access"
            description="Our AI agents have complete access to a full operating system environment. They can execute commands, manage files, run scripts, and control every aspect of the system - imagine the power!"
            stats="Full OS Control"
            visualElement={
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-purple-400" />
              </div>
            }
          />
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white font-semibold text-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            Start Building Your AI Agent
          </Link>
        </motion.div>
      </div>
    </section>
  );
}