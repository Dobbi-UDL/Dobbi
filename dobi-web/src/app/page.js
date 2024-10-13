import Header from "../components/Header";
import Hero from "../components/Hero";

const BG_COLOR = '#FFFCF9';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div>
          Body content here
        </div>
      </main>
    </div>
  );
}
