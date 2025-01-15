import "./globals.css";
import { ScrollProvider } from "../contexts/ScrollContext";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export const metadata = {
  title: 'Dobbi',
  description: 'Your financial advisor',
  icons: {
    icon: '/dobbi-avatar.png',
    apple: '/dobbi-avatar.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ScrollProvider>
            <Header />
            {children}
            <Footer />
          </ScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
