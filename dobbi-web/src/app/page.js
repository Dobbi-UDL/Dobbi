"use client";

import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/homepage/Hero";
import Features from "@/components/homepage/Features";
import CTA from "@/components/homepage/CTA";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/contexts/AuthContext";


const BG_COLOR = '#FFFCF9';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {user ? <Navbar /> : <Header />}
      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
