'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Terminal,
  Globe,
  BarChart3,
  Play,
  ChevronRight
} from 'lucide-react';

// Compact Demo Card - Apple-inspired minimal design
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
  const getDemoPreview = () => {
    switch (demoType) {
      case 'terminal':
        return (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 font-mono text-xs">
            <div className="text-gray-600 dark:text-gray-400 mb-1">$ docker build -t myapp .</div>
            <div className="text-green-600 dark:text-green-400">✓ Build successful</div>
          </div>
        );
      case 'web':
        return (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">localhost:3000</div>
          </div>
        );
      case 'analysis':
        return (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium">Analysis</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">247 sources → 15 insights</div>
          </div>
        );
    }
  };

  return (
    <motion.div
      className={`group cursor-pointer transition-all duration-300 ${
        isActive
          ? 'bg-white dark:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-700'
          : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800/50 border-gray-100 dark:border-gray-800'
      } border rounded-xl p-6`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onClick={onActivate}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
        }`}>
          <Icon className={`w-5 h-5 transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Compact demo preview */}
      <div className="mb-4">
        {getDemoPreview()}
      </div>

      {/* Minimal action indicator */}
      <div className={`flex items-center gap-2 text-sm transition-colors ${
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
      }`}>
        <Play className="w-3 h-3" />
        <span>View demo</span>
        <ChevronRight className="w-3 h-3 ml-auto" />
      </div>
    </motion.div>
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
      icon: BarChart3,
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
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Compact header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            Capabilities in Action
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            See how autonomous AI agents handle real-world tasks
          </p>
        </div>

        {/* Compact demo grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Minimal CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Ready to deploy your own autonomous AI agent?
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Start Building
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}