import { HeroVideoDialog } from '@/components/home/ui/hero-video-dialog';
import { Play } from 'lucide-react';

export function HeroVideoSection() {
  return (
    <section
      id="demo"
      className="w-full py-16"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Compact header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            See Intelligence in Action
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Watch how autonomous AI agents execute complex workflows with precision
          </p>
        </div>

        {/* Compact video container */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="fade"
              videoSrc="https://www.youtube.com/embed/Jnxq0osSg2c?si=k8ddEM8h8lver20s"
              thumbnailSrc="/thumbnail-light.png"
              thumbnailAlt="Demo Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="fade"
              videoSrc="https://www.youtube.com/embed/Jnxq0osSg2c?si=k8ddEM8h8lver20s"
              thumbnailSrc="/thumbnail-dark.png"
              thumbnailAlt="Demo Video"
            />

            {/* Minimal play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Play className="w-6 h-6 text-gray-900 dark:text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Subtle caption */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Xera executing a complex deployment workflow autonomously
          </p>
        </div>
      </div>
    </section>
  );
}
