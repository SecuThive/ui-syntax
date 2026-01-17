'use client';

import React from 'react';

interface PreviewProps {
  code: string;
}

export default function PreviewComponent({ code }: PreviewProps) {
  // 간단한 코드 표시 (실제 렌더링은 복잡하므로 나중에 구현)
  // 지금은 코드 블록을 제거하고 JSX만 표시
  
  let displayCode = code;
  
  // ```tsx 제거
  displayCode = displayCode.replace(/^```(?:tsx|jsx|typescript|javascript)?\n?/m, '');
  displayCode = displayCode.replace(/\n?```$/m, '');
  
  return (
    <div className="w-full max-w-md">
      <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="text-sm text-zinc-400 mb-4">
          <p className="font-semibold text-zinc-300">Component Preview</p>
          <p className="text-xs mt-1">Code rendering in development</p>
        </div>
        <div className="p-4 rounded border border-zinc-700 bg-zinc-950">
          <pre className="text-xs text-zinc-300 overflow-auto max-h-64">
            {displayCode.substring(0, 500)}
            {displayCode.length > 500 ? '...' : ''}
          </pre>
        </div>
      </div>
    </div>
  );
}
