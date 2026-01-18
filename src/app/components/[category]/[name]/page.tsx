'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Component {
  id?: string;
  category: string;
  name: string;
  code: string;
  description?: string;
}

const CATEGORIES = {
  button: ['primary', 'secondary', 'outline'],
  card: ['basic', 'elevated', 'interactive'],
  input: ['text', 'email', 'textarea'],
  alert: ['success', 'error', 'warning', 'info'],
  badge: ['default', 'success', 'error'],
  modal: ['basic', 'confirm']
};

interface PageProps {
  params: { category: string; name: string };
}

export default function ComponentDetailPage({ params }: PageProps) {
  const { category, name } = params;
  const [component, setComponent] = useState<Component | null>(null);
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(400);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || !name) {
      setLoading(false);
      return;
    }

    const fetchComponent = async () => {
      try {
        const res = await fetch(`/api/components/${category}/${name}`);
        if (!res.ok) {
          console.warn(`[Page] API returned ${res.status}`);
          setComponent(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setComponent(data);
        setLoading(false);
      } catch (error) {
        console.error('[Page] Fetch failed:', error);
        setComponent(null);
        setLoading(false);
      }
    };

    fetchComponent();
  }, [category, name]);

  useEffect(() => {
    if (!component?.code) {
      setHtml('');
      setLoading(false);
      return;
    }

    const renderPreview = async () => {
      try {
        const res = await fetch('/api/render', {
          method: 'POST',
          body: JSON.stringify({ code: component.code }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          console.error(`[Page] Render API returned ${res.status}`);
          setHtml('');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setHtml(data.html || '');
        setLoading(false);
      } catch (error) {
        console.error('[Page] Render failed:', error);
        setHtml('');
        setLoading(false);
      }
    };

    renderPreview();
  }, [component]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'resize' && e.data?.height) {
        setIframeHeight(Math.max(e.data.height + 40, 300));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const copyCode = () => {
    if (component?.code) {
      navigator.clipboard.writeText(component.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!component && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Component Not Found</h1>
          <Link href="/components" className="text-blue-400 hover:text-blue-300">← Back to Components</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">UI Syntax</Link>
          <Link href="/components" className="text-slate-400 hover:text-white transition">← Components</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-700 px-4 py-3">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Components</h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {Object.entries(CATEGORIES).map(([cat, items]) => (
                  <div key={cat} className="border-b border-slate-800 last:border-0">
                    <div className="px-4 py-2 bg-slate-800/50">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider capitalize">{cat}</h3>
                    </div>
                    <div className="py-1">
                      {items.map(item => {
                        const isActive = cat === category && item === name;
                        return (
                          <Link
                            key={item}
                            href={`/components/${cat}/${item}`}
                            className={`block px-4 py-2 text-sm transition ${
                              isActive 
                                ? 'bg-blue-600/20 text-blue-300 font-medium border-l-2 border-blue-500' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="capitalize">{item}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <Link href="/components" className="hover:text-white transition">Components</Link><span>/</span>
                <span className="text-white capitalize">{category}</span><span>/</span>
                <span className="text-white capitalize">{name}</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 capitalize">{name}</h1>
              <p className="text-lg text-slate-300">{component?.description || 'Component preview'}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50">
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-700 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>Live Preview
                    </h2>
                  </div>
                  <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 min-h-96 flex items-center justify-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400">Rendering preview...</p>
                      </div>
                    ) : html ? (
                      <iframe srcDoc={html} className="w-full bg-slate-950 rounded-lg" style={{ height: `${iframeHeight}px`, border: 'none' }} sandbox="allow-scripts allow-same-origin" />
                    ) : (
                      <p className="text-slate-400">Failed to render preview</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 sticky top-24">
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Code</h2>
                    <button onClick={copyCode} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${copied ? 'bg-green-600/20 text-green-300' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words"><code>{component?.code}</code></pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-slate-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800"><p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Category</p><p className="text-white font-semibold capitalize">{category}</p></div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800"><p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Component</p><p className="text-white font-semibold capitalize">{name}</p></div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800"><p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Status</p><p className="text-green-400 font-semibold">Available</p></div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800"><p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Framework</p><p className="text-white font-semibold">React + Tailwind</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
