import React from 'react';
import { motion } from 'framer-motion';

export const AgentLoader = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Sleek animated dots */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-1.5 bg-primary/60 rounded-full"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </div>
      
      {/* Subtle text indicator */}
      <motion.span
        className="text-xs text-muted-foreground font-medium"
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Thinking...
      </motion.span>
    </div>
  );
};

