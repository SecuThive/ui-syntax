'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ComponentPageClient from './page-client';
import PreviewComponent from './preview-dynamic';
import DesignSelector from '@/components/DesignSelector';

export default function ComponentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const category = params.category as string;
  const variant = params.variant as string;
  const designId = searchParams.get('design');

  const [codeContent, setCodeContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let code = null;
        
        if (designId) {
          // 특정 디자인 ID로 fetch
          const response = await fetch(`/api/designs/${designId}`);
          if (response.ok) {
            const data = await response.json();
            code = data.design?.code;
          }
        } else {
          // 최신 published 디자인 fetch
          const response = await fetch(`/api/designs?category=${category}&variant=${variant}&status=published`);
          if (response.ok) {
            const data = await response.json();
            const designs = data.designs || [];
            if (designs.length > 0) {
              code = designs[0].code;
            }
          }
        }
        
        if (!code) {
          throw new Error('No code available');
        }
        
        setCodeContent(code);
      } catch (err) {
        console.error('Error fetching code:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCodeContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [designId, category, variant]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-6xl mx-auto w-full px-6 py-12 md:px-8 md:py-16">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm mb-8 text-zinc-500">
          <span className="text-zinc-400">Components</span>
          <span>/</span>
          <span className="text-zinc-300 capitalize">{category}</span>
          <span>/</span>
          <span className="text-zinc-300 capitalize">{variant}</span>
        </div>

        {/* Header with Design Selector */}
        <div className="space-y-3 mb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-zinc-50 capitalize">
                {category} - {variant}
              </h1>
            </div>
            <DesignSelector category={category} variant={variant} />
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-bold text-zinc-50">Preview</h2>
          <div className="p-12 rounded-lg border border-zinc-800 bg-zinc-900 min-h-96 overflow-auto max-h-[500px] flex items-center justify-center">
            {loading ? (
              <p className="text-zinc-500">Loading preview...</p>
            ) : error ? (
              <p className="text-red-400">Error: {error}</p>
            ) : codeContent ? (
              <PreviewComponent code={codeContent} />
            ) : (
              <p className="text-zinc-500">No code available</p>
            )}
          </div>
        </div>

        {/* Code Section */}
        {loading ? (
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-500">Loading code...</p>
          </div>
        ) : codeContent ? (
          <ComponentPageClient content="" code={codeContent} />
        ) : (
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-500">No code available</p>
          </div>
        )}
      </div>
    </div>
  );
}
