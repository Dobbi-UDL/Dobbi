import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";

const BG_COLOR = '#FFFCF9';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <div>
          More content here...
        </div>
      </main>
    </div>
  );
}
