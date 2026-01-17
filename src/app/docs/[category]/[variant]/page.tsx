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
    </div>
  );
}
