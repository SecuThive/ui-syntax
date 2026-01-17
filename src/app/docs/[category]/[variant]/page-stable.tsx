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

async function getDesignCode(designId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ui-syntax.vercel.app'}/api/designs/${designId}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.design?.code || null;
  } catch (error) {
    console.error('Error fetching design:', error);
    return null;
  }
}

export default async function ComponentPage({ params, searchParams }: ComponentPageProps) {
  const { category, variant } = await params;
  const { design: designId } = await searchParams;
  const component = await getComponentBySlug(`${category}/${variant}`);

  if (!component) {
    notFound();
  }

  // 1) 선택된 디자인 ID가 있으면 해당 디자인 코드 사용
  let codeContent = null;
  if (designId) {
    codeContent = await getDesignCode(designId);
  }
  
  // 2) 선택된 디자인이 없거나 실패하면 최신 DB 공개 디자인 코드 사용
  if (!codeContent) {
    codeContent = await getLatestPublishedDesignCode(category, variant);
  }
  
  // 3) DB에도 없으면 메타데이터 또는 본문에서 추출
  if (!codeContent) {
    const fallbackCode = component.metadata.code 
      ? (component.metadata.code as string) 
      : extractCode(component.content);
    codeContent = fallbackCode;
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

      {/* Details Section */}
      <div className="space-y-6 pt-8 border-t border-zinc-800">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-50">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailCard label="Category" value={component.metadata.category ? component.metadata.category.charAt(0).toUpperCase() + component.metadata.category.slice(1) : 'N/A'} />
            <DetailCard label="Variant" value={component.metadata.variant ? component.metadata.variant.charAt(0).toUpperCase() + component.metadata.variant.slice(1) : 'N/A'} />
            <DetailCard label="Status" value="Production Ready" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-50">Usage Guide</h3>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-4 text-zinc-400 text-sm leading-relaxed">
            <p>
              <span className="text-zinc-300 font-semibold">1. Copy the Code</span><br />
              Click the "Copy Code" button above to copy the component code to your clipboard.
            </p>
            <p>
              <span className="text-zinc-300 font-semibold">2. Paste into Your Project</span><br />
              Paste the code into your React/TypeScript project. Make sure you have the necessary dependencies installed.
            </p>
            <p>
              <span className="text-zinc-300 font-semibold">3. Customize</span><br />
              Modify the component props and styles to match your design requirements. All components use Tailwind CSS for styling.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-50">Dependencies</h3>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-2 text-sm">
            <p className="text-zinc-400">This component requires:</p>
            <ul className="space-y-2 text-zinc-300 font-mono">
              <li>✓ React 18+</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-lg font-semibold text-zinc-50">{value}</p>
    </div>
  );
}
