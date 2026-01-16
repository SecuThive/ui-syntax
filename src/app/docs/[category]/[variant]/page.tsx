import { getComponentBySlug, getAllComponents } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import ComponentPageClient from './page-client';
import React from 'react';
import PreviewComponent from './preview-simple';

interface ComponentPageProps {
  params: Promise<{
    category: string;
    variant: string;
  }>;
}

interface ComponentPageProps {
  params: Promise<{
    category: string;
    variant: string;
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
  // 마크다운 코드 블록에서 코드만 추출 (첫 번째 코드 블록을 가져옵니다)
  const match = content.match(/```(?:[\w-]+)?\s+([\s\S]*?)```/);
  return match ? match[1].trim() : '// No code available';
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { category, variant } = await params;
  const component = await getComponentBySlug(`${category}/${variant}`);

  if (!component) {
    notFound();
  }

  // 메타데이터에 코드가 없으면 본문에서 추출하여 사용
  const codeContent = component.metadata.code 
    ? (component.metadata.code as string) 
    : extractCode(component.content);

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
        <h1 className="text-5xl font-bold text-zinc-50">{component.metadata.title}</h1>
        {component.metadata.description && (
          <p className="text-lg text-zinc-400 max-w-2xl">{component.metadata.description}</p>
        )}
      </div>

      {/* Live Preview Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-50">Preview</h2>
        <div className="p-12 rounded-lg border border-zinc-800 bg-zinc-950 min-h-96 overflow-auto max-h-[500px] flex items-center justify-center">
          {/* 변경됨: code 대신 category와 variant를 전달합니다 */}
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