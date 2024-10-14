import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPage from "@/components/auth/LoginPage";

const BG_COLOR = '#FFFCF9';
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <LoginPage />
            </main>
            <Footer />
        </div>
    );
}
