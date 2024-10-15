"use client";

import Hero from "@/components/homepage/Hero";
import Features from "@/components/homepage/Features";
import CTA from "@/components/homepage/CTA";
import { useAuth } from "@/contexts/AuthContext";


const BG_COLOR = '#FFFCF9';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>
    </div>
  );
}
