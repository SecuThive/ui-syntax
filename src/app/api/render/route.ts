import { NextRequest, NextResponse } from 'next/server';

interface RenderRequest {
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = (await request.json()) as RenderRequest;

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // 1. import 제거
    const codeWithoutImports = code
      .replace(/^import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?\n*/gm, '')
      .trim();

    // 2. export default 제거
    const withoutExport = codeWithoutImports
      .replace(/export\s+default\s+/, '')
      .trim();

    // 3. JSX를 React.createElement로 변환
    // 이는 간단한 변환이고, 복잡한 JSX는 동작하지 않을 수 있음
    // JSX 지원을 위해 Babel 트랜스포일이 필요하지만, 
    // 다른 접근: JSX 없이 React.createElement 방식으로 코드 생성하도록 프롬프트 수정
    
    // 4. 컴포넌트명 추출
    const constMatch = withoutExport.match(/const\s+(\w+)\s*=\s*\(?\)?/);
    const funcMatch = withoutExport.match(/function\s+(\w+)\s*\(/);
    const componentName = constMatch ? constMatch[1] : funcMatch ? funcMatch[1] : 'Component';

    // iframe용 HTML 생성 - Babel을 사용하여 클라이언트에서 JSX 변환
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; }
    body { 
      display: flex; 
      justify-content: center; 
      align-items: flex-start; 
      padding: 16px 0; 
      background: transparent; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      min-height: auto;
    }
    #root { 
      display: flex; 
      justify-content: center; 
      align-items: flex-start;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
(function renderComponent() {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  
  if (!React || !ReactDOM) {
    document.body.innerHTML = '<div style="color: #ff6b6b; padding: 20px; background: #2a2a2a; border-radius: 4px;">Error: React libraries not loaded</div>';
    return;
  }
  
  try {
    ${withoutExport}
    
    const Component = ${componentName};
    if (typeof Component !== 'function') {
      throw new Error('Component must be a function. Got: ' + typeof Component);
    }
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Component />);
    
    // 높이 자동 조정을 위해 ResizeObserver 설정
    setTimeout(() => {
      const getContentHeight = () => {
        const root = document.getElementById('root');
        if (!root) return 0;
        return Math.ceil(root.getBoundingClientRect().height + 32);
      };
      
      const observer = new ResizeObserver(() => {
        const height = getContentHeight();
        if (height > 0) {
          window.parent.postMessage({ type: 'resize', height }, '*');
        }
      });
      observer.observe(document.getElementById('root'));
      
      // 초기 높이 전송
      const height = getContentHeight();
      if (height > 0) {
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    }, 150);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    document.body.innerHTML = '<div style="color: #ff6b6b; padding: 20px; background: #2a2a2a; border-radius: 4px; border-left: 4px solid #ff6b6b; font-family: monospace; white-space: pre-wrap; max-width: 600px;"><strong>Render Error:</strong><br>' + errorMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
    console.error('Component render error:', e);
  }
})();
  <\/script>
</body>
</html>`;

    return NextResponse.json({
      success: true,
      html,
    });
  } catch (error: any) {
    console.error('[RenderAPI] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to render component',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
