"use client";

import './globals.css';
import { ScrollProvider } from '../contexts/ScrollContext';
import { AuthProvider } from '../contexts/AuthContext';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ScrollProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}