'use client';

import React from 'react';

interface PreviewProps {
  category: string;
  variant: string;
}

export default function PreviewComponent({ category, variant }: PreviewProps) {
  const key = `${category.toLowerCase()}-${variant.toLowerCase()}`;

  const previews: Record<string, React.ReactNode> = {
    // Button Previews
    'button-primary': (
      <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors border border-zinc-100">
        Primary Button
      </button>
    ),
    'button-ghost': (
      <button className="px-4 py-2 text-zinc-300 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
        Ghost Button
      </button>
    ),
    'button-neumorphic': (
      <button className="px-6 py-3 bg-zinc-900 text-zinc-100 rounded-2xl font-medium shadow-lg shadow-black/50 hover:shadow-xl transition-all hover:translate-y-0.5">
        Neumorphic Button
      </button>
    ),
    'button-outlined': (
      <button className="px-4 py-2 bg-transparent text-zinc-100 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
        Outlined Button
      </button>
    ),
    'button-gradient': (
      <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
        Gradient Button
      </button>
    ),
    // Card Previews
    'card-default': (
      <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-50 mb-2">Card Title</h3>
        <p className="text-zinc-400">This is a default card component with clean styling.</p>
      </div>
    ),
    'card-elevated': (
      <div className="p-6 rounded-lg bg-zinc-900 shadow-xl shadow-black/50 border border-zinc-800/50">
        <h3 className="text-lg font-semibold text-zinc-50 mb-2">Elevated Card</h3>
        <p className="text-zinc-400">This card has enhanced depth with shadow effects.</p>
      </div>
    ),
    'card-interactive': (
      <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group">
        <h3 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-blue-400 transition-colors">Interactive Card</h3>
        <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Click me for interaction</p>
      </div>
    ),
    'card-gradient': (
      <div className="p-6 rounded-lg bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700">
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 mb-2">Gradient Card</h3>
        <p className="text-zinc-400">A card with gradient background styling</p>
      </div>
    ),
    'card-compact': (
      <div className="p-4 rounded-md border border-zinc-800 bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-50">Compact</h3>
        <p className="text-xs text-zinc-400">Smaller card variant</p>
      </div>
    ),
    // Input Previews
    'input-text': (
      <input 
        type="text" 
        placeholder="Enter text..." 
        className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full max-w-xs" 
      />
    ),
    'input-search': (
      <div className="w-full max-w-sm relative">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full px-4 py-2 pl-10 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors" 
        />
        <svg className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    ),
    'input-password': (
      <div className="w-full max-w-sm relative">
        <input type="password" placeholder="Enter password..." className="w-full px-4 py-2 pr-10 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors" />
        <button className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    ),
    'input-email': (
      <div className="w-full max-w-sm">
        <input type="email" placeholder="your@email.com" className="w-full px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
      </div>
    ),
    // Modal Preview (simplified)
    'modal-basic': (
      <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-zinc-50 mb-2">Modal Title</h2>
        <p className="text-zinc-400 mb-4">This is a basic modal component.</p>
        <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors">
          Close
        </button>
      </div>
    ),
    // Loading Bar / Progress Bar
    'loading-bar': (
      <div className="w-full max-w-sm space-y-4">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-100 w-[65%] rounded-full" />
        </div>
        <p className="text-xs text-zinc-400">65% Complete</p>
      </div>
    ),
    'loading-spinner': (
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-zinc-100 animate-spin" />
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    ),
    'loading-pulse': (
      <div className="space-y-3 w-full max-w-sm">
        <div className="h-12 bg-zinc-800 rounded-md animate-pulse" />
        <div className="h-12 bg-zinc-800 rounded-md animate-pulse" />
        <div className="h-12 bg-zinc-800 rounded-md animate-pulse w-2/3" />
      </div>
    ),
    // Badge / Tag variations
    'badge-primary': (
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 bg-zinc-100 text-zinc-950 rounded-full text-xs font-medium">Primary</span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">Info</span>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">Success</span>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">Error</span>
      </div>
    ),
    'badge-secondary': (
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 text-sm font-medium bg-zinc-800 text-zinc-200 rounded-full border border-zinc-700">Secondary</span>
        <span className="px-3 py-1 text-sm font-medium bg-zinc-800 text-zinc-200 rounded-full border border-zinc-700">Badge</span>
      </div>
    ),
    'badge-success': (
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 text-sm font-medium bg-green-900/30 text-green-300 rounded-full border border-green-700/50">Success</span>
        <span className="px-3 py-1 text-sm font-medium bg-green-900/30 text-green-300 rounded-full border border-green-700/50">Complete</span>
      </div>
    ),
    // Toggle / Switch
    'toggle-switch': (
      <div className="flex items-center gap-3">
        <button className="relative w-12 h-6 bg-zinc-100 rounded-full transition-colors">
          <div className="absolute top-1 left-1 w-4 h-4 bg-zinc-950 rounded-full transition-transform" />
        </button>
        <span className="text-sm text-zinc-400">Enabled</span>
      </div>
    ),
    // Skeleton Loader
    'skeleton-card': (
      <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900 w-full max-w-sm space-y-3">
        <div className="h-6 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
      </div>
    ),
    'text-gradient': (
      <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
        Gradient Text
      </h2>
    ),
    // Alert / Toast
    'alert-info': (
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3 w-full max-w-sm">
        <div className="w-5 h-5 rounded-full bg-blue-500/30 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-400">Information</p>
          <p className="text-xs text-blue-400/70">This is an info alert message.</p>
        </div>
      </div>
    ),
    'alert-success': (
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3 w-full max-w-sm">
        <div className="w-5 h-5 rounded-full bg-green-500/30 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-400">Success</p>
          <p className="text-xs text-green-400/70">Operation completed successfully.</p>
        </div>
      </div>
    ),
    'alert-warning': (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3 w-full max-w-sm">
        <div className="w-5 h-5 rounded-full bg-yellow-500/30 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-400">Warning</p>
          <p className="text-xs text-yellow-400/70">Please pay attention to this message.</p>
        </div>
      </div>
    ),
    'alert-error': (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 w-full max-w-sm">
        <div className="w-5 h-5 rounded-full bg-red-500/30 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-400">Error</p>
          <p className="text-xs text-red-400/70">An error has occurred.</p>
        </div>
      </div>
    ),
    // Divider
    'divider-line': (
      <div className="w-full max-w-sm space-y-4">
        <p className="text-sm text-zinc-400">Content above</p>
        <div className="h-px bg-zinc-800" />
        <p className="text-sm text-zinc-400">Content below</p>
      </div>
    ),
    // Button Group
    'button-group': (
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-l-md font-medium hover:bg-zinc-200 transition-colors">
          Left
        </button>
        <button className="px-4 py-2 border-l border-r border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors">
          Center
        </button>
        <button className="px-4 py-2 text-zinc-300 rounded-r-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
          Right
        </button>
      </div>
    ),
  };

  return (
    <div className="flex items-center justify-center w-full">
      {previews[key] || <p className="text-zinc-400">Preview not available</p>}
    </div>
  );
}
