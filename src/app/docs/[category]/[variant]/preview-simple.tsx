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
        console.error('Error fetching code:', err);
        setError('Failed to load component');
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
    return <div className="text-zinc-400">No preview available</div>;
  }

  return <ComponentPreviewRenderer code={code} />;
}

function ComponentPreviewRenderer({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('[Preview] Starting render with code:', code.substring(0, 100));
      
      // 1. import 제거
      const codeWithoutImports = code
        .replace(/^import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?\n*/gm, '')
        .trim();

      console.log('[Preview] After removing imports:', codeWithoutImports.substring(0, 100));

      // 2. export default 제거
      const withoutExport = codeWithoutImports
        .replace(/export\s+default\s+/, '')
        .trim();

      console.log('[Preview] After removing export:', withoutExport.substring(0, 100));

      // 3. 모든 선언된 함수/컴포넌트 이름 추출 (const X = ... 또는 function X)
      const constMatch = withoutExport.match(/const\s+(\w+)\s*=\s*\(?\)?/);
      const funcMatch = withoutExport.match(/function\s+(\w+)\s*\(/);
      const componentName = constMatch ? constMatch[1] : funcMatch ? funcMatch[1] : 'Component';

      console.log('[Preview] Component name extracted:', componentName);
      console.log('[Preview] Const match:', constMatch?.[1], 'Func match:', funcMatch?.[1]);

      // 4. Function() 내에서 코드를 실행하고 정의된 컴포넌트 찾아 반환
      const func = new Function('React', `
        ${withoutExport}
        return ${componentName};
      `);

      console.log('[Preview] Function created, executing...');
      const component = func(React);
      
      console.log('[Preview] Component result:', component, 'is function?', typeof component === 'function');

      if (component && typeof component === 'function') {
        setComponent(() => component);
        console.log('[Preview] Component set successfully');
      } else {
        setRenderError(`Component not a function`);
        console.log('[Preview] Component is not a function');
      }
    } catch (err) {
      console.error('[Preview] Error rendering component:', err);
      setRenderError(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }, [code]);

  if (renderError) {
    return <div className="text-yellow-400 text-sm">{renderError}</div>;
  }

  if (!Component) {
    return <div className="text-zinc-400 text-sm">Rendering...</div>;
  }

  try {
    return <Component />;
  } catch (err) {
    console.error('Error during render:', err);
    return <div className="text-red-400 text-sm">Render failed</div>;
  }
}
