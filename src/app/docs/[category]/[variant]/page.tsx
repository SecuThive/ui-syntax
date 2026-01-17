import { getComponentBySlug, getAllComponents } from '@/lib/mdx';
import { getLatestPublishedDesignCode } from '@/lib/designs';
import { notFound } from 'next/navigation';
import ComponentPageClient from './page-client';
import React from 'react';
import PreviewComponent from './preview-simple';
import DesignSelector from '@/components/DesignSelector';

interface ComponentPageProps {
  params: Promise<{
    category: string;
    variant: string;
  }>;
  searchParams: Promise<{
    design?: string;
  }>;
}

export async function generateStaticParams() {
  const components = await getAllComponents();
  return components.map((component) => {
    const parts = component.slug.split('/');
    return {
      category: parts[0],
      variant: parts[1],
    };
  });
}

export async function generateMetadata({ params }: ComponentPageProps) {
  const { category, variant } = await params;
  const component = await getComponentBySlug(`${category}/${variant}`);

  if (!component) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${component.metadata.title} - UI Syntax`,
    description: component.metadata.description,
  };
}

function extractCode(content: string): string {
  const match = content.match(/```(?:[\w-]+)?\s+([\s\S]*?)```/);
  return match ? match[1].trim() : '// No code available';
}

export default async function ComponentPage({ params, searchParams }: ComponentPageProps) {
  const { category, variant } = await params;
  const { design: designId } = await searchParams;
  const component = await getComponentBySlug(`${category}/${variant}`);

  if (!component) {
    notFound();
  }

  // 1) Get code from database
  let codeContent = await getLatestPublishedDesignCode(category, variant);
  
  // 2) Fallback to MDX metadata or content
  if (!codeContent) {
    codeContent = component.metadata.code 
      ? (component.metadata.code as string) 
      : extractCode(component.content);
  }

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 pt-4">
        <a href="/" className="hover:text-zinc-300 transition-colors">Home</a>
        <span>/</span>
        <a href="/docs" className="hover:text-zinc-300 transition-colors">Docs</a>
        <span>/</span>
        <a href={`/docs/${category}`} className="hover:text-zinc-300 transition-colors capitalize">
          {category}
        </a>
        <span>/</span>
        <span className="text-zinc-300 capitalize">{variant}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-zinc-50">{component.metadata.title}</h1>
            {component.metadata.description && (
              <p className="text-lg text-zinc-400 max-w-2xl mt-3">{component.metadata.description}</p>
            )}
          </div>
          <DesignSelector category={category} variant={variant} />
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-50">Preview</h2>
        <div className="p-12 rounded-lg border border-zinc-800 bg-zinc-950 min-h-96 overflow-auto max-h-[500px] flex items-center justify-center">
          <PreviewComponent category={category} variant={variant} />
        </div>
      </div>

      {/* Code Section */}
      <ComponentPageClient content={component.content} code={codeContent} />

      {/* Details & Information Section */}
      <div className="space-y-8 pt-8 border-t border-zinc-800">
        {/* Component Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-50">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Category</p>
              <p className="text-lg font-semibold text-zinc-50 capitalize">{category}</p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Variant</p>
              <p className="text-lg font-semibold text-zinc-50 capitalize">{variant}</p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Status</p>
              <p className="text-lg font-semibold text-emerald-400">Production Ready</p>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-50">How to Use</h3>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-5">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-zinc-200 font-semibold">Copy the Code</p>
                  <p className="text-sm text-zinc-400 mt-1">Click the "Copy Code" button above to copy the component code to your clipboard.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-zinc-200 font-semibold">Paste into Your Project</p>
                  <p className="text-sm text-zinc-400 mt-1">Add the code to your React/Next.js project. Make sure Tailwind CSS is configured.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-zinc-200 font-semibold">Customize & Extend</p>
                  <p className="text-sm text-zinc-400 mt-1">Modify the styling, add props, or extend functionality to match your design system.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dependencies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-50">Dependencies</h3>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-400 text-sm mb-4">This component requires:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-800/50">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-200 font-mono text-sm">React 18+</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-800/50">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-200 font-mono text-sm">TypeScript</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-800/50">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-200 font-mono text-sm">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Highlights */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-50">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600/10">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-200 font-semibold mb-1">Fully Responsive</p>
                  <p className="text-sm text-zinc-400">Works seamlessly across all device sizes</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-600/10">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-200 font-semibold mb-1">Customizable</p>
                  <p className="text-sm text-zinc-400">Easy to modify and extend with Tailwind</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/10">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-200 font-semibold mb-1">Type Safe</p>
                  <p className="text-sm text-zinc-400">Full TypeScript support included</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-600/10">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-zinc-200 font-semibold mb-1">Zero Dependencies</p>
                  <p className="text-sm text-zinc-400">No external packages required</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-50">Tips & Best Practices</h3>
          <div className="p-6 rounded-lg border border-zinc-700 bg-blue-950/20">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="space-y-2 text-sm">
                <p className="text-blue-200 font-semibold">Pro Tip</p>
                <p className="text-blue-100/80">Use the design selector above to explore different style variations. Each design is production-ready and can be used immediately in your project.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
