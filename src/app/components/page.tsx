'use client';

import { useState } from 'react';
import Link from 'next/link';

const COMPONENTS = {
  button: [
    { name: 'primary', description: 'Primary action button' },
    { name: 'secondary', description: 'Secondary action button' },
    { name: 'outline', description: 'Outline button style' },
  ],
  card: [
    { name: 'basic', description: 'Basic card component' },
    { name: 'elevated', description: 'Elevated card with shadow' },
    { name: 'interactive', description: 'Interactive card component' },
  ],
  input: [
    { name: 'text', description: 'Text input field' },
    { name: 'email', description: 'Email input field' },
    { name: 'textarea', description: 'Large text area' },
  ],
  alert: [
    { name: 'success', description: 'Success alert message' },
    { name: 'error', description: 'Error alert message' },
    { name: 'warning', description: 'Warning alert message' },
    { name: 'info', description: 'Info alert message' },
  ],
  badge: [
    { name: 'default', description: 'Default badge' },
    { name: 'success', description: 'Success badge' },
    { name: 'error', description: 'Error badge' },
  ],
  modal: [
    { name: 'basic', description: 'Basic modal dialog' },
    { name: 'confirm', description: 'Confirmation modal' },
  ],
};

const CATEGORIES = Object.keys(COMPONENTS) as Array<keyof typeof COMPONENTS>;

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof COMPONENTS>('button');

  const components = COMPONENTS[selectedCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UI Syntax
          </Link>
          <div className="flex gap-4">
            <Link href="/components" className="text-slate-400 hover:text-white transition">
              Components
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <aside className="hidden md:block w-64 border-r border-slate-800 bg-slate-950/30 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
                <span className="text-xs text-slate-500 ml-2">
                  ({COMPONENTS[cat].length})
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 capitalize">
              {selectedCategory} Components
            </h1>
            <p className="text-slate-400">
              {components.length} component{components.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Categories for mobile - only show on mobile */}
          <div className="md:hidden flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize text-sm ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((comp) => (
              <Link
                key={comp.name}
                href={`/components/${selectedCategory}/${comp.name}`}
                className="group p-6 rounded-xl border border-slate-800 hover:border-blue-600/50 hover:bg-slate-800/30 transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-white capitalize group-hover:text-blue-400 transition mb-2">
                  {comp.name}
                </h3>
                <p className="text-slate-400 text-sm">{comp.description}</p>
                <div className="mt-4 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition">
                  View component →
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
