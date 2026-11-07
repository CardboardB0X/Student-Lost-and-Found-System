import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus Lost and Found System | Enterprise Custody & RBAC Hub',
  description: 'Enterprise Student Lost and Found System with strict Role-Based Access Control, blind-proof verification, and chain of custody tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F5F5F5] text-[#242424] min-h-screen">
        {children}
      </body>
    </html>
  );
}
