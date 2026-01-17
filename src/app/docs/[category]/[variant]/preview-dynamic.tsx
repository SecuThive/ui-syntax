'use client';

import React, { useMemo } from 'react';

interface PreviewProps {
  code: string;
}

export default function PreviewComponent({ code }: PreviewProps) {
  // 코드에서 JSX 부분 추출
  const extractJSX = (code: string): string => {
    // ```tsx 또는 ``` 제거
    let cleaned = code.replace(/^```(?:tsx|jsx|javascript)?\n?/m, '').replace(/\n?```$/m, '');
    
    // export default 또는 export 제거
    cleaned = cleaned.replace(/export\s+(?:default\s+)?(?:function|const)\s+\w+\s*\(\s*\)\s*\{/, '');
    cleaned = cleaned.replace(/^export\s+default\s+/, '');
    
    // 마지막 } 제거
    cleaned = cleaned.replace(/\}\s*$/, '');
    
    return cleaned.trim();
  };

  const jsx = useMemo(() => extractJSX(code), [code]);

  // 동적으로 컴포넌트 렌더링 시도
  try {
    // eval을 사용하여 JSX 렌더링 (주의: 프로덕션에서는 더 안전한 방법 필요)
    const React_Local = React;
    // eslint-disable-next-line no-eval
    const Component = eval(`(function() { const React = React_Local; return (${jsx}); })()`);
    
    return <>{Component}</>;
  } catch (err) {
    // 실패 시 static preview 표시
    return (
      <div className="w-full p-6 rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="text-sm text-zinc-500 font-mono">
          <p className="text-yellow-600 mb-2">Preview not available</p>
          <p className="text-xs text-zinc-400">Code:</p>
          <pre className="text-xs overflow-auto max-h-64 text-zinc-300">
            {code.substring(0, 300)}...
          </pre>
        </div>
      </div>
    );
  }
}
