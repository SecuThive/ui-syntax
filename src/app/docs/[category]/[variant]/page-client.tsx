'use client';

import { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface ComponentPageClientProps {
  content: string;
  code?: string;
}

export default function ComponentPageClient({ content, code }: ComponentPageClientProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeToDisplay = code || content;

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
