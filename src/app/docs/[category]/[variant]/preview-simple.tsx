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
    console.log('[Preview] Component mounted, category:', category, 'variant:', variant, 'designId:', designId);
    
    const fetchCode = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedCode = '';
        let fetchUrl = '';
        
        if (designId) {
          fetchUrl = `/api/designs/${designId}`;
          console.log('[Preview] Fetching by ID:', fetchUrl);
          const response = await fetch(fetchUrl);
          console.log('[Preview] Response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            fetchedCode = data.design?.code || '';
            console.log('[Preview] Got code from ID, length:', fetchedCode.length);
          } else {
            console.log('[Preview] Response not ok:', await response.text());
          }
        } else {
          fetchUrl = `/api/designs?category=${category}&variant=${variant}&status=published`;
          console.log('[Preview] Fetching by category/variant:', fetchUrl);
          const response = await fetch(fetchUrl);
          console.log('[Preview] Response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            const designs = data.designs || [];
            console.log('[Preview] Found designs:', designs.length);
            if (designs.length > 0) {
              fetchedCode = designs[0].code || '';
              console.log('[Preview] Got code from list, length:', fetchedCode.length);
            }
          } else {
            console.log('[Preview] Response not ok:', await response.text());
          }
        }
        
        console.log('[Preview] Setting code, length:', fetchedCode.length);
        setCode(fetchedCode);
      } catch (err) {
        console.error('[Preview] Error fetching code:', err);
        setError(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [designId, category, variant]);

  console.log('[Preview] Render state - loading:', loading, 'error:', error, 'code length:', code.length);

  if (loading) {
    return <div className="text-zinc-400">Loading preview...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!code) {
    return <div className="text-zinc-400">No preview available (no code)</div>;
  }

  console.log('[Preview] Rendering ComponentPreviewRenderer');
  return <ComponentPreviewRenderer code={code} />;
}

function ComponentPreviewRenderer({ code }: { code: string }) {
  const [iframeHtml, setIframeHtml] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const renderComponent = async () => {
      try {
        console.log('[Preview] ComponentPreviewRenderer mounted, code length:', code.length);
        console.log('[Preview] Sending code to render API');
        console.log('[Preview] Code preview:', code.substring(0, 100));
        
        const response = await fetch('/api/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        console.log('[Preview] Render API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('[Preview] Render API error:', errorData);
          setRenderError(`Render failed: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        console.log('[Preview] Render successful, HTML length:', data.html.length);
        console.log('[Preview] HTML preview:', data.html.substring(0, 200));
        setIframeHtml(data.html);
        setRenderError(null);
      } catch (err) {
        console.error('[Preview] Error calling render API:', err);
        setRenderError(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    };

    renderComponent();
  }, [code]);

  console.log('[Preview] ComponentPreviewRenderer render - iframeHtml:', iframeHtml.length, 'renderError:', renderError);

  if (renderError) {
    return <div className="text-yellow-400 text-sm">{renderError}</div>;
  }

  if (!iframeHtml) {
    return <div className="text-zinc-400 text-sm">Rendering... (iframe HTML not set)</div>;
  }

  return (
    <iframe
      srcDoc={iframeHtml}
      className="w-full border border-zinc-700 rounded-lg bg-white"
      style={{ minHeight: '400px' }}
      sandbox={{
        allowScripts: true,
        allowSameOrigin: true,
      } as any}
    />
  );
}
