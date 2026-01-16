'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCategoryStructure } from '@/lib/mdx';
import { Sidebar, SidebarDrawer, SidebarToggle, SidebarItem } from '@/components/Sidebar';

interface Category {
  category: string;
  variants: string[];
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoryStructure();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 카테고리 데이터를 SidebarItem으로 변환
  const sidebarItems: SidebarItem[] = categories.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    children: cat.variants.map((variant) => ({
      name: variant.charAt(0).toUpperCase() + variant.slice(1),
      href: `/docs/${cat.category.toLowerCase()}/${variant.toLowerCase()}`,
    })),
  }));

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

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Mobile Drawer */}
      <SidebarDrawer
        items={sidebarItems}
        title="UI Syntax"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:flex md:w-64 flex-shrink-0 h-screen border-r border-zinc-800 sticky top-0">
        <Sidebar items={sidebarItems} title="UI Syntax" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-4 border-b border-zinc-800 bg-zinc-900/30 flex-shrink-0">
          <SidebarToggle onClick={() => setIsSidebarOpen(true)} />
          <h1 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">Docs</h1>
        </div>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:px-8 md:py-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
