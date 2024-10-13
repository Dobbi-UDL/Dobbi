import Header from "../components/Header";


const BG_COLOR = '#fff0e8';
export default function Home() {
  return (
    <div style={{ backgroundColor: BG_COLOR, color: 'white' }}>
      <Header />
      {/* Dummy content to allow scrolling */}
      <main>
        <div style={{ height: '200vh' }}>
        </div>
      </main>
    </div>
  );
}
