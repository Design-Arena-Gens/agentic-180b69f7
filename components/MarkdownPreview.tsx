"use client";

import DOMPurify from "isomorphic-dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  markdown: string;
}

export function MarkdownPreview({ markdown }: Props) {
  const sanitized = DOMPurify.sanitize(markdown);

  return (
    <div className="card max-h-[80vh] overflow-y-auto text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 text-2xl font-bold text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 text-xl font-semibold text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 text-lg font-semibold text-slate-100">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-3 text-slate-300">{children}</p>,
          li: ({ children }) => <li className="ml-6 list-disc text-slate-300">{children}</li>,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border border-slate-800/80">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-slate-800 bg-slate-900/80 px-3 py-2 text-left text-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-800 px-3 py-2 text-slate-300">{children}</td>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-900/80 px-2 py-1 text-xs text-emerald-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-lg bg-slate-950/90 p-4 text-xs text-emerald-200">
              {children}
            </pre>
          )
        }}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}
