'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function ExpandableDescription({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = content.length > 300;

  return (
    <div>
      <div className="relative">
        <div 
          className={`overflow-hidden transition-all duration-700 ease-in-out ${
            !isLong ? 'max-h-none' : isExpanded ? 'max-h-[5000px]' : 'max-h-[320px]'
          }`}
        >
          <div className="prose prose-lg prose-slate font-serif text-slate-700 leading-relaxed max-w-none text-center">
            <ReactMarkdown
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl md:text-2xl font-serif text-slate-900 mt-10 mb-4 text-center" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="whitespace-pre-line text-lg md:text-[21px] mb-6 text-center" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-slate-900" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {isLong && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {isLong && !isExpanded && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setIsExpanded(true)}
            className="border border-slate-900 bg-transparent px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            Read More
          </button>
        </div>
      )}
    </div>
  );
}
