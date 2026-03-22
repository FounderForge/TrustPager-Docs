import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'json', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#282c34]">
      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-700">
          <span className="text-xs font-medium text-gray-400">{title}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Code */}
      <div className="relative max-h-[500px] overflow-auto">
        {!title && (
          <button
            onClick={handleCopy}
            className={cn(
              'absolute top-3 right-3 z-10 p-1.5 rounded-md transition-colors',
              'text-gray-400 hover:text-white hover:bg-gray-700'
            )}
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.6',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
