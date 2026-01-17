'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, Code } from 'lucide-react';

interface ComponentPageClientProps {
  content: string;
  code?: string;
  category?: string;
  variant?: string;
}

export default function ComponentPageClient({ content, code: initialCode, category, variant }: ComponentPageClientProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeToDisplay, setCodeToDisplay] = useState(initialCode || content);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const designId = searchParams.get('design');

  // Fetch selected design code when design parameter changes
  useEffect(() => {
    if (designId && category && variant) {
      const fetchDesignCode = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/designs/${designId}`);
          if (response.ok) {
            const data = await response.json();
            const fetchedCode = data.design?.code || '';
            setCodeToDisplay(fetchedCode);
          }
        } catch (error) {
          console.error('Error fetching design:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDesignCode();
    } else {
      // Reset to initial code if no design selected
      setCodeToDisplay(initialCode || content);
    }
  }, [designId, category, variant, initialCode, content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-50">Code</h2>
        <div className="flex items-center gap-3">
          {loading && <span className="text-xs text-zinc-500">Loading...</span>}
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-colors text-sm font-medium"
          >
            <Code className="w-4 h-4" />
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-50 transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {showCode && (
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950 overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
            {codeToDisplay}
          </pre>
        </div>
      )}
    </div>
  );
}
