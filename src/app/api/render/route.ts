import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    // 코드 정리
    let cleaned = code
      .replace(/```tsx[\s\S]*?```/g, '')
      .replace(/```jsx[\s\S]*?```/g, '')
      .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
      .replace(/export\s+default\s+/g, '')
      .trim();

    // 컴포넌트 이름 정규화
    let normalized = cleaned;
    
    // const MyComponent = ... 패턴
    const constMatch = cleaned.match(/const\s+(\w+)\s*=/);
    if (constMatch) {
      normalized = cleaned.replace(new RegExp(`const\\s+${constMatch[1]}\\s*=`), 'const App =');
    }
    
    // function MyComponent() 패턴
    const funcMatch = cleaned.match(/function\s+(\w+)\s*\(/);
    if (funcMatch) {
      normalized = cleaned.replace(new RegExp(`function\\s+${funcMatch[1]}\\s*\\(`), 'function App(');
    }
    
    // 순수 JSX (< 로 시작)
    if (!constMatch && !funcMatch && cleaned.startsWith('<')) {
      normalized = `const App = () => (${cleaned})`;
    }
    
    // 그 외의 경우
    if (!constMatch && !funcMatch && !cleaned.startsWith('<')) {
      normalized = `const App = ${cleaned}`;
    }

    // 특수 문자 이스케이프
    const escaped = normalized
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    // HTML 생성
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'; }
    .error { background: #7f1d1d; color: #fca5a5; padding: 16px; border-radius: 6px; font-family: monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${escaped}
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
      
      // 높이 감지
      new ResizeObserver(() => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      }).observe(document.body);
    } catch (err) {
      document.getElementById('root').innerHTML = '<div class="error">Error: ' + (err.message || String(err)) + '</div>';
    }
  </script>
</body>
</html>`;

    return NextResponse.json({ html });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
