import './globals.css'; // Import your global styles

export const metadata = {
  title: 'Dobbi',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <header className="p-4 bg-white shadow-md">Dobbi</header>
          <main className="flex-1 p-4">{children}</main>
          <footer className="p-4 bg-gray-100 text-center">Footer</footer>
        </div>
      </body>
    </html>
  );
}
