import { getComponentBySlug, getAllComponents } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import ComponentPageClient from './page-client';
import React from 'react';

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

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { category, variant } = await params;
  const component = await getComponentBySlug(`${category}/${variant}`);

  if (!component) {
    notFound();
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
      <ComponentPageClient content={component.content} code={component.metadata.code as string} />

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

/* -------------------------------------------------------------------------- */
/* Preview Logic Start                             */
/* -------------------------------------------------------------------------- */

// 1. 여기에 실제 렌더링될 컴포넌트들을 정의합니다.
// (나중에는 별도 파일에서 import 해오는 것이 좋습니다)

const PrimaryButton = () => (
  <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors border border-zinc-100">
    Primary Button
  </button>
);

const GhostButton = () => (
  <button className="px-4 py-2 text-zinc-300 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
    Ghost Button
  </button>
);

const NeumorphicButton = () => (
  <button className="px-6 py-3 bg-zinc-900 text-zinc-100 rounded-2xl font-medium shadow-lg shadow-black/50 hover:shadow-xl transition-all hover:translate-y-0.5">
    Neumorphic Button
  </button>
);

const DefaultCard = () => (
  <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900 max-w-sm w-full">
    <h3 className="text-lg font-semibold text-zinc-50 mb-2">Card Title</h3>
    <p className="text-zinc-400">This is a default card component with clean styling.</p>
  </div>
);

const ElevatedCard = () => (
  <div className="p-6 rounded-lg bg-zinc-900 shadow-xl shadow-black/50 max-w-sm w-full">
    <h3 className="text-lg font-semibold text-zinc-50 mb-2">Elevated Card</h3>
    <p className="text-zinc-400">This card has enhanced depth with shadow effects.</p>
  </div>
);

const InputField = () => (
  <input 
    type="text" 
    placeholder="Enter text..." 
    className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full max-w-xs" 
  />
);

const BasicModal = () => (
  <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 max-w-md w-full">
    <h2 className="text-xl font-semibold text-zinc-50 mb-2">Modal Title</h2>
    <p className="text-zinc-400 mb-4">This is a basic modal component preview.</p>
    <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors">Close</button>
  </div>
);

// 2. 정의한 컴포넌트를 slug(category/variant)와 매핑합니다.
// 키 값은 실제 MDX 파일 경로(slug)와 정확히 일치해야 합니다.
const COMPONENT_REGISTRY: Record<string, React.FC> = {
  // Buttons
  'button/primary': PrimaryButton, // 폴더명이 buttons라면 'buttons/primary'로 수정
  'button/ghost': GhostButton,
  'button/neumorphic': NeumorphicButton,
  
  // Cards
  'card/default': DefaultCard,
  'card/elevated': ElevatedCard,
  
  // Inputs
  'input/text': InputField,
  
  // Modals
  'modal/basic': BasicModal,
};

function PreviewComponent({ category, variant }: { category: string; variant: string }) {
  const slug = `${category}/${variant}`;
  const Component = COMPONENT_REGISTRY[slug];

  if (!Component) {
    return (
      <div className="text-center">
        <p className="text-zinc-400 mb-2">No preview found for:</p>
        <code className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 text-sm">
          {slug}
        </code>
        <p className="text-zinc-500 text-xs mt-4">
          Check if the component is registered in <strong>COMPONENT_REGISTRY</strong>
        </p>
      </div>
    );
  }

  return <Component />;
}