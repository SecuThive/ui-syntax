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
          const response = await fetch(`/api/designs/${designId}`);
          if (response.ok) {
            const data = await response.json();
            fetchedCode = data.design?.code || '';
          }
        } else {
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
        setError(`Failed to load: ${err instanceof Error ? err.message : 'unknown'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [designId, category, variant]);

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
  const [iframeHeight, setIframeHeight] = useState<number>(150);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'resize' && event.data?.height) {
        setIframeHeight(Math.max(event.data.height, 150));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const renderComponent = async () => {
      try {
        const response = await fetch('/api/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setRenderError(`Render failed: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        setIframeHtml(data.html);
        setRenderError(null);
      } catch (err) {
        setRenderError(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    };

    renderComponent();
  }, [code]);

  if (renderError) {
    return <div className="text-yellow-400 text-sm">{renderError}</div>;
  }

  if (!iframeHtml) {
    return <div className="text-zinc-400 text-sm">Rendering...</div>;
  }

  return (
    <iframe
      srcDoc={iframeHtml}
      className="w-full rounded-lg"
      style={{ 
        height: `${iframeHeight}px`, 
        background: '#0a0a0a', 
        border: '1px solid #333', 
        transition: 'height 0.2s ease',
        overflow: 'hidden'
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}
