'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PreviewProps {
  category: string;
  variant: string;
}

export default function PreviewComponent({ category, variant }: PreviewProps) {
  const searchParams = useSearchParams();
  const designId = searchParams.get('design');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedCode = '';
        
        if (designId) {
          // Fetch specific design
          const response = await fetch(`/api/designs/${designId}`);
          if (response.ok) {
            const data = await response.json();
            fetchedCode = data.design?.code || '';
          }
        } else {
          // Fetch latest design
          const response = await fetch(`/api/designs?category=${category}&variant=${variant}&status=published`);
          if (response.ok) {
            const data = await response.json();
            const designs = data.designs || [];
            if (designs.length > 0) {
              fetchedCode = designs[0].code || '';
            }
          }
        }
        
        setCode(fetchedCode);
      } catch (err) {
        console.error('Error fetching code:', err);
        setError('Failed to load component');
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [designId, category, variant]);

  // Fallback previews for when code rendering fails
  const fallbackPreviews: Record<string, React.ReactNode> = {
    'button-primary': (
      <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors border border-zinc-100">
        Primary Button
      </button>
    ),
    'button-outlined': (
      <button className="px-4 py-2 bg-transparent text-zinc-100 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
        Outlined Button
      </button>
    ),
    'card-compact': (
      <div className="p-4 rounded-md border border-zinc-800 bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-50">Card</h3>
        <p className="text-xs text-zinc-400">Component preview</p>
      </div>
    ),
  };

  const key = `${category.toLowerCase()}-${variant.toLowerCase()}`;
  const fallback = fallbackPreviews[key];

  if (loading) {
    return <div className="text-zinc-400">Loading preview...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!code) {
    return fallback || <div className="text-zinc-400">No preview available</div>;
  }

  // Try to render the dynamically generated code
  return (
    <ComponentPreviewRenderer code={code} fallback={fallback} />
  );
}

// Safely renders dynamically generated component code
function ComponentPreviewRenderer({ code, fallback }: { code: string; fallback?: React.ReactNode }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Remove imports since we'll provide React globally
      const codeWithoutImports = code
        .replace(/^import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?\n*/gm, '')
        .trim();

      // Execute code and get the default export
      const func = new Function('React', `
        ${codeWithoutImports}
        return PrimaryButton || Component || (() => null);
      `);

      const component = func(React);
      if (component && typeof component === 'function') {
        setComponent(() => component);
      } else {
        setRenderError('Component export not found');
      }
    } catch (err) {
      console.error('Error rendering component:', err);
      setRenderError('Failed to render');
    }
  }, [code]);

  if (renderError) {
    return fallback || <div className="text-yellow-400 text-sm">{renderError}</div>;
  }

  if (!Component) {
    return fallback || <div className="text-zinc-400 text-sm">Rendering...</div>;
  }

  try {
    return <Component />;
  } catch (err) {
    console.error('Error during render:', err);
    return fallback || <div className="text-red-400 text-sm">Render failed</div>;
  }
}
