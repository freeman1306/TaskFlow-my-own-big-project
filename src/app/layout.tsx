import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
