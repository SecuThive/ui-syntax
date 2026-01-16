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
    // Input Previews
    'input-text': (
      <input 
        type="text" 
        placeholder="Enter text..." 
        className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full max-w-xs" 
      />
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
    // Input variations
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
    // Divider
    'divider': (
      <div className="w-full max-w-sm space-y-4">
        <p className="text-sm text-zinc-400">Content above</p>
        <div className="h-px bg-zinc-800" />
        <p className="text-sm text-zinc-400">Content below</p>
      </div>
    ),
    // Gradient Text
    'gradient-text': (
      <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
        Gradient Text
      </h2>
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
