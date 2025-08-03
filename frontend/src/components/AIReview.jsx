import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIReview = ({ code, language, onClose }) => {
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);

  const getAIReview = async () => {
    if (!code.trim()) {
      setError('Please write some code before requesting a review.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasRequested(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_COMPILER_BASE_URL}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: code,
          language: language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReview(data.review || 'No review available.');
      } else {
        throw new Error(data.error || 'Failed to get AI review');
      }
    } catch (err) {
      console.error('Error getting AI review:', err);
      setError(err.message || 'Failed to connect to AI review service');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-request review when component mounts
  React.useEffect(() => {
    if (!hasRequested) {
      getAIReview();
    }
  }, []);

  // Custom components for markdown styling
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-white mt-6 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-white mt-5 mb-3 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-gray-200 mt-4 mb-2 first:mt-0">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 mb-3 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc text-gray-300 mb-4 space-y-2 ml-6">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal text-gray-300 mb-4 space-y-2 ml-6">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-300 leading-relaxed">
        {children}
      </li>
    ),
    code: ({ inline, children, ...props }) => {
      if (inline) {
        return (
          <code className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="bg-gray-800 rounded-lg overflow-x-auto mb-4 border border-gray-700">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 mb-3 bg-gray-800/30 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-300">
        {children}
      </em>
    ),
    a: ({ children, href }) => (
      <a 
        href={href} 
        className="text-purple-400 hover:text-purple-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        {review && !isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">AI Code Review</h3>
              <p className="text-gray-400 text-sm">Language: {language.toUpperCase()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="text-gray-300">Analyzing your code...</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={getAIReview}
              className="mt-3 text-red-400 hover:text-red-300 text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Review Content */}
        {review && !isLoading && (
          <div className="pb-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/30">
              <div className="markdown-content">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {review}
                </Markdown>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!review && !isLoading && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-400">Waiting for code to review...</p>
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      {review && !isLoading && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-600/30">
          <div className="text-gray-500 text-sm">
            Review generated • Just now
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReview;