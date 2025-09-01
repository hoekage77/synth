'use client';

import { useEffect, useState } from 'react';
import { BentoSection } from '@/components/home/sections/bento-section';
import { PricingSection } from '@/components/home/sections/pricing-section';
import { ModalProviders } from '@/providers/modal-providers';
import { BackgroundAALChecker } from '@/components/auth/background-aal-checker';
import { TestimonialSection } from '@/components/home/sections/testimonial-section';
import { FAQSection } from '@/components/home/sections/faq-section';

export default function Home() {
  return (
    <>
      <ModalProviders />
      <BackgroundAALChecker>
        <main className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
          <div className="w-full max-w-7xl mx-auto">
            <BentoSection />
            <PricingSection />
            <TestimonialSection />
            <FAQSection />
          </div>
        </main>
      </BackgroundAALChecker>
    </>
  );
}
