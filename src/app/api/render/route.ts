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

    console.log('[RenderAPI] Component name:', componentName);
    console.log('[RenderAPI] Code:', withoutExport.substring(0, 150));

    // iframe용 HTML 생성 - JSX 트랜스포일 불가능하므로
    // 대신 Babel을 CDN에서 로드하여 클라이언트에서 실시간 변환
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    
    try {
      ${withoutExport}
      
      const Component = ${componentName};
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<Component />);
    } catch (e) {
      document.body.innerHTML = '<div style="color: red; padding: 20px;"><strong>Render Error:</strong><br>' + e.message + '</div>';
      console.error(e);
    }
  </script>
</body>
</html>
    `;

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
