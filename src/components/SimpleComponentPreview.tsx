import { codeToHtml } from 'shiki';

interface SimpleComponentPreviewProps {
  component: React.ReactNode;
  code: string;
  language?: string;
}

export async function SimpleComponentPreview({
  component,
  code,
  language = 'tsx',
}: SimpleComponentPreviewProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  });

  return (
    <div className="space-y-6">
      {/* Preview Section */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 flex items-center justify-center min-h-[300px]">
        {component}
      </div>

      {/* Code Section */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800">
          <span className="text-xs text-zinc-400">{language}</span>
        </div>
        <div
          className="p-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
