/* eslint-disable @next/next/no-img-element */
import { Marquee } from '@/components/home/ui/marquee';
import { cn } from '@/lib/utils';

export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      'flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-6 relative group',
      // Futuristic dark styles
      'bg-black/40 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40',
      'shadow-[0px_0px_20px_rgba(6,182,212,0.1)] hover:shadow-[0px_0px_30px_rgba(6,182,212,0.2)]',
      'transition-all duration-300 hover:scale-[1.02]',
      className,
    )}
    {...props}
  >
    {/* Holographic glow effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    {/* Scanning line effect */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
    
    <div className="relative z-10 select-none leading-relaxed font-normal text-cyan-200/90 font-mono text-sm">
      {description}
    </div>

    <div className="relative z-10 flex w-full select-none items-center justify-start gap-3.5">
      {/* Futuristic avatar with glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
        <img src={img} alt={name} className="relative size-10 rounded-full border border-cyan-500/30" />
      </div>

      <div>
        <p className="font-medium text-cyan-300 font-mono text-sm">{name}</p>
        <p className="text-xs font-normal text-cyan-400/70 font-mono">{role}</p>
      </div>
    </div>
  </div>
);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  img: string;
  description: React.ReactNode;
}

export function SocialProofTestimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="h-full">
      <div className="px-10">
        <div className="relative max-h-[750px] overflow-hidden">
          <div className="gap-0 md:columns-2 xl:columns-3">
            {Array(Math.ceil(testimonials.length / 3))
              .fill(0)
              .map((_, i) => (
                <Marquee
                  vertical
                  key={i}
                  className={cn({
                    '[--duration:60s]': i === 1,
                    '[--duration:30s]': i === 2,
                    '[--duration:70s]': i === 3,
                  })}
                >
                  {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                    <TestimonialCard {...card} key={idx} />
                  ))}
                </Marquee>
              ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 md:h-1/5 w-full bg-gradient-to-t from-black from-20%"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 md:h-1/5 w-full bg-gradient-to-b from-black from-20%"></div>
        </div>
      </div>
    </div>
  );
}
