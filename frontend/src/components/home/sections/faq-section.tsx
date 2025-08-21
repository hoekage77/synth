import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/home/ui/accordion';
import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';
import { motion } from 'motion/react';

export function FAQSection() {
  const { faqSection } = siteConfig;

  return (
    <section
      id="faq"
      className="flex flex-col items-center justify-center gap-10 pb-20 w-full relative bg-black text-white"
    >
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/20 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
      
      {/* Terminal grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #00ff00 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      {/* Scanning line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30"
        animate={{ y: ['-100%', '100vh'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="relative w-full px-6 z-10">
        <SectionHeader>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-balance font-mono">
            <span className="text-white">PLATFORM_</span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              SUPPORT
            </span>
          </h2>
          <p className="text-gray-300 text-center text-balance font-mono">
            Access comprehensive platform documentation and premium support resources
          </p>
        </SectionHeader>

        <div className="max-w-3xl w-full mx-auto px-4">
          {/* Terminal header */}
          <div className="bg-black/80 border border-green-500/30 rounded-t-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-green-400 font-mono text-sm">XERA_SUPPORT_v2.1.0</span>
            </div>
          </div>
          
          <div className="bg-black/60 border-x border-b border-green-500/30 rounded-b-lg p-4 backdrop-blur-sm">
            <div className="text-green-400 font-mono text-sm mb-4">$ cat system_faq.log</div>
            
            <Accordion
              type="single"
              collapsible
              className="w-full border-b-0 grid gap-3"
            >
              {faqSection.faQitems.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                  className="border-0 grid gap-2"
                >
                  <AccordionTrigger className="bg-black/60 border border-green-500/30 rounded-lg px-4 py-3.5 cursor-pointer no-underline hover:no-underline hover:bg-green-500/10 data-[state=open]:bg-green-500/20 data-[state=open]:border-green-400/50 text-white font-mono transition-all duration-300">
                    <span className="text-green-400 mr-2">{">"}</span>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border border-green-500/20 rounded-lg bg-black/40 backdrop-blur-sm">
                    <p className="text-gray-300 font-mono leading-relaxed">
                      <span className="text-green-400 mr-2">{"$"}</span>
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
