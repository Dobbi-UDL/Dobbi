"use client";

import './globals.css'; 
import { ScrollProvider } from '../contexts/ScrollContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
