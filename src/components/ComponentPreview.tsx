'use client';

import React from 'react';
import { codeToHtml } from 'shiki';

interface ComponentPreviewProps {
  component: React.ReactNode;
  code: string;
  language?: string;
  title?: string;
  description?: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = async ({ code, language = 'tsx' }) => {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  });

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400">{language}</span>
      </div>
      <div
        className="p-4 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export async function ComponentPreview({
  component,
  code,
  language = 'tsx',
  title,
  description,
}: ComponentPreviewProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">{title}</h1>
          {description && (
            <p className="text-zinc-400 text-base">{description}</p>
          )}
        </div>
      )}

      {/* Preview Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Preview
        </h2>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 flex items-center justify-center min-h-[300px]">
          {component}
        </div>
      </div>

      {/* Code Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
          Code
        </h2>
        <CodeBlock code={code} language={language} />
      </div>
    </div>
  );
}

export function SimpleComponentPreview({
  component,
  code,
  language = 'tsx',
}: Omit<ComponentPreviewProps, 'title' | 'description'>) {
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
        <pre className="p-4 overflow-x-auto text-zinc-300 text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
