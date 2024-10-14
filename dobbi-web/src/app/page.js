import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/homepage/Hero";
import Features from "@/components/homepage/Features";
import CTA from "@/components/homepage/CTA";
import Footer from "@/components/common/Footer";

const BG_COLOR = '#FFFCF9';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn ? <Navbar /> : <Header />}
      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
