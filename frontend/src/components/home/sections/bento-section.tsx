'use client';

import { SectionHeader } from '@/components/home/section-header';
import { FirstBentoAnimation } from '@/components/home/first-bento-animation';
import { SecondBentoAnimation } from '@/components/home/second-bento-animation';
import { ThirdBentoAnimation } from '@/components/home/third-bento-animation';
import { motion } from 'motion/react';

// Enhanced Holographic Orbs Effect
const HolographicOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => {
        // Use deterministic percentage-based positioning to avoid hydration issues
        const baseX = ((i * 137.5) % 100);
        const baseY = ((i * 73.3) % 100);
        const duration = 20 + (i % 15);
        const delay = i * 0.3;

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${baseX}%`,
              y: `${baseY}%`,
              scale: 0
            }}
            animate={{
              x: `${baseX + (i % 4 === 0 ? 15 : i % 4 === 1 ? -15 : i % 4 === 2 ? 8 : -8)}%`,
              y: `${baseY + (i % 3 === 0 ? 12 : i % 3 === 1 ? -12 : 6)}%`,
              scale: [0, 1.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay
            }}
          >
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br opacity-8 blur-2xl ${
              i % 4 === 0 ? 'from-cyan-400 to-blue-600' :
              i % 4 === 1 ? 'from-purple-400 to-pink-600' :
              i % 4 === 2 ? 'from-green-400 to-emerald-600' :
              'from-orange-400 to-red-600'
            }`} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Enhanced Scanning Lines Effect
const ScanningLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-25"
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-15"
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 3 }}
      />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-10"
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1.5 }}
      />
    </div>
  );
};

// Deeper Space Background
const DeeperSpaceBackground = () => {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden bg-gradient-to-b from-black via-slate-950/30 to-slate-900">
      {/* Enhanced nebula effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 15% 25%, cyan/12 0%, transparent 60%), radial-gradient(circle at 85% 75%, purple/10 0%, transparent 60%), radial-gradient(circle at 45% 45%, blue/8 0%, transparent 80%), radial-gradient(circle at 75% 15%, green/6 0%, transparent 70%)",
            "radial-gradient(circle at 25% 75%, purple/15 0%, transparent 60%), radial-gradient(circle at 75% 25%, cyan/8 0%, transparent 60%), radial-gradient(circle at 55% 55%, blue/10 0%, transparent 80%), radial-gradient(circle at 15% 85%, orange/5 0%, transparent 70%)",
            "radial-gradient(circle at 85% 35%, cyan/10 0%, transparent 60%), radial-gradient(circle at 15% 65%, purple/12 0%, transparent 60%), radial-gradient(circle at 65% 65%, blue/9 0%, transparent 80%), radial-gradient(circle at 35% 25%, green/7 0%, transparent 70%)",
            "radial-gradient(circle at 15% 25%, cyan/12 0%, transparent 60%), radial-gradient(circle at 85% 75%, purple/10 0%, transparent 60%), radial-gradient(circle at 45% 45%, blue/8 0%, transparent 80%), radial-gradient(circle at 75% 15%, green/6 0%, transparent 70%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Enhanced star field */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration issues
          const left = ((i * 137.5) % 100) + (i % 10) * 0.1;
          const top = ((i * 73.3) % 100) + (i % 7) * 0.1;
          const delay = (i * 0.15) % 3;
          const duration = 3 + (i % 4);

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.5, 0.8],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export function BentoSection() {
  const bentoItems = [
    {
      id: 1,
      content: <FirstBentoAnimation />,
      title: 'Conversational Design',
      description:
        'Describe your needs naturally and watch as our AI builds sophisticated agents tailored to your requirements.',
    },
    {
      id: 2,
      content: <SecondBentoAnimation />,
      title: 'Universal Integration',
      description:
        'Seamlessly connect with any tool, API, or service through our intelligent integration framework.',
    },
    {
      id: 3,
      content: <ThirdBentoAnimation />,
      title: 'Autonomous Execution',
      description:
        'Deploy agents that learn, adapt, and execute complex workflows with human-like reasoning and problem-solving.',
    },
  ];

  return (
    <section
      id="process"
      className="flex flex-col items-center justify-center w-full relative overflow-hidden min-h-screen bg-black text-white py-32"
    >
      {/* Deeper Space Background */}
      <DeeperSpaceBackground />

      {/* Enhanced Holographic Orbs */}
      <HolographicOrbs />

      {/* Enhanced Scanning Lines */}
      <ScanningLines />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 pt-16">
        <div className="max-w-7xl mx-auto w-full text-center">

          {/* Status Indicator - Intelligent Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-mono text-sm tracking-wider">
                INTELLIGENT CAPABILITIES • ADVANCED AI SYSTEMS
              </span>
            </div>
          </motion.div>

          {/* Enhanced Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <motion.span
                className="block bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                INTELLIGENT
              </motion.span>
              <motion.span
                className="block font-mono tracking-wider text-white/90"
                initial={{ letterSpacing: "0.1em" }}
                animate={{ letterSpacing: ["0.1em", "0.15em", "0.1em"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                CAPABILITIES
              </motion.span>
              <motion.span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                SHOWCASE
              </motion.span>
            </h2>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="text-xl sm:text-2xl text-gray-300 font-mono max-w-5xl mx-auto leading-relaxed">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 3, delay: 1 }}
                viewport={{ once: true }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Experience the power of intelligent automation
              </motion.span>
              <br />
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 3, delay: 1.5 }}
                viewport={{ once: true }}
                className="inline-block overflow-hidden whitespace-nowrap"
              >
                Through our advanced AI agent capabilities
              </motion.span>
            </p>
          </motion.div>

          {/* Enhanced Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="relative w-full px-6">
              <div className="max-w-7xl mx-auto border-l border-r border-border/50 backdrop-blur-sm bg-black/20 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden border-t border-border/50">
                  {bentoItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-start justify-end min-h-[700px] md:min-h-[600px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-gradient-to-r after:from-transparent after:via-border/50 after:to-transparent after:content-[''] group cursor-pointer max-h-[500px] group hover:bg-gradient-to-br hover:from-cyan-500/5 hover:to-purple-500/5 transition-all duration-500"
                    >
                      <div className="relative flex size-full items-center justify-center h-full overflow-hidden rounded-lg">
                        {item.content}
                      </div>
                      <div className="flex-1 flex-col gap-4 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-xl tracking-tighter font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
