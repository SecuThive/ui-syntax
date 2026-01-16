'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <motion.div
        className="flex h-screen bg-zinc-950 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-zinc-400">Loading...</div>
      </motion.div>
    );
  }

  const isDocsPage = pathname.startsWith('/docs');

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-sm">UI</span>
            </div>
            <span className="font-bold text-zinc-50 text-lg">Syntax</span>
          </div>
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center gap-12">
          <Link href="/">
            <span
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Home
            </span>
          </Link>
          <Link href="/docs">
            <span
              className={`text-sm font-medium transition-colors ${
                isDocsPage
                  ? 'text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Components
            </span>
          </Link>
        </div>

        {/* Right side - Version */}
        <div className="text-xs text-zinc-500">v1.0</div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-6 py-12 md:px-8 md:py-16">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm py-6 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 UI Syntax. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-300 transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
