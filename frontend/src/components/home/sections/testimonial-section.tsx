import { SectionHeader } from '@/components/home/section-header';
import { SocialProofTestimonials } from '@/components/home/testimonial-scroll';
import { siteConfig } from '@/lib/home';
import { motion } from 'motion/react';

export function TestimonialSection() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="flex flex-col items-center justify-center w-full relative bg-black text-white py-24 overflow-hidden"
    >
      {/* Enhanced futuristic background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-transparent to-blue-500/8"></div>
      
      {/* Animated grid pattern overlay */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Multiple scanning lines for enhanced effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
        animate={{ y: ['-100%', '100vh'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20"
        animate={{ y: ['100vh', '-100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 5 }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 73.3) % 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      <div className="relative w-full px-6 z-10">
        <SectionHeader>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center text-balance font-mono mb-6">
            <span className="text-white">NEURAL_</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              FEEDBACK
            </span>
            <span className="text-white">_LOOP</span>
          </h2>
          <p className="text-cyan-200 text-center text-balance font-mono text-lg max-w-3xl mx-auto leading-relaxed">
            Real-time operator testimonials from global deployment zones • Performance validation protocols active
          </p>
        </SectionHeader>
        
        {/* Enhanced testimonial container */}
        <div className="relative mt-16">
          {/* Container glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 rounded-2xl blur-3xl" />
          
          <div className="relative bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
            <SocialProofTestimonials testimonials={testimonials} />
          </div>
        </div>
      </div>
    </section>
  );
}
