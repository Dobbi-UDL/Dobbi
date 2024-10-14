"use client";

import './globals.css'; 
import { ScrollProvider } from '../contexts/ScrollContext';
import { AuthProvider } from '../contexts/AuthContext';

import Footer from '../components/common/Footer';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ScrollProvider>
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