import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Modal from '../components/Modal.jsx';
import AIReview from '../components/AIReview.jsx';

function Code() {
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const languageOptions = [
    { value: 'py', label: 'Python', monacoLanguage: 'python' },
    { value: 'java', label: 'Java', monacoLanguage: 'java' },
    { value: 'cpp', label: 'C++', monacoLanguage: 'cpp' },
    { value: 'c', label: 'C', monacoLanguage: 'c' },
  ];

  const codeTemplates = {
    py: `def hello_world():\n    print("Hello, World!")\n\nhello_world()`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language] || '');
    setOutput('');
    setIsError(false);
  };

  const getMonacoLanguage = (language) => {
    const lang = languageOptions.find(lang => lang.value === language);
    return lang ? lang.monacoLanguage : 'javascript';
  };

  const formatOutput = (text, isError = false) => {
    if (!text) return '';
    return text.split('\n').map(line => `> ${line}`).join('\n');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('> Running code...');
    setIsError(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_COMPILER_BASE_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          extension: selectedLanguage, 
          content: code, 
          input: input 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOutput(formatOutput(data.output || 'Program executed successfully (no output)'));
        setIsError(false);
      } else {
        let errorOutput = '';
        
        if (data.error) {
          errorOutput += `Error: ${data.error}\n`;
        }
        
        if (data.details) {
          errorOutput += `Details: ${data.details}\n`;
        }
        
        if (data.partialOutput) {
          errorOutput += `Partial Output:\n${data.partialOutput}\n`;
        }
        
        if (data.timeout) {
          errorOutput += 'Program execution timed out (10 seconds limit)\n';
        }
        
        setOutput(formatOutput(errorOutput.trim()));
        setIsError(true);
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(formatOutput('Network error: Unable to connect to compiler service'));
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const clearAll = () => {
    setCode('');
    setInput('');
    setOutput('');
    setIsError(false);
  };

  const openReviewModal = () => {
    if (!code.trim()) {
      setOutput(formatOutput('Please write some code before requesting a review.'));
      setIsError(true);
      return;
    }
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-20 relative">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Code Editor</h1>
            <p className="text-gray-300">Write, edit, and test your code online</p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-8">
            
            {/* Code Editor - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Language Selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-white font-medium">Language:</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-gray-800/50 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={clearAll}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => handleLanguageChange(selectedLanguage)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
                      >
                        Reset
                      </button>
                      
                      {/* AI Review Button */}
                      <button
                        onClick={openReviewModal}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Review
                      </button>
                      
                      <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={`${
                          isRunning 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white px-4 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2`}
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Running...
                          </>
                        ) : (
                          <>
                            Run Code
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <Editor
                    height="400px"
                    language={getMonacoLanguage(selectedLanguage)}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      wordWrap: 'on',
                      folding: true,
                      lineNumbersMinChars: 3,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8
                      },
                      renderLineHighlight: 'line',
                      cursorStyle: 'line',
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Input & Output - Right Side */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Test Case Input */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
                  <span className="text-white font-medium">Test Case Input</span>
                </div>
                <div className="p-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your test case input here..."
                    className="w-full h-32 bg-gray-900/50 text-white border border-gray-600/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                    style={{
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                    }}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Output</span>
                    {isError && (
                      <span className="text-red-400 text-xs">Error</span>
                    )}
                    {!isError && output && output !== '> Running code...' && (
                      <span className="text-green-400 text-xs">Success</span>
                    )}
                  </div>
                </div>
                <div className="p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                  <pre className={`font-mono text-sm whitespace-pre-wrap ${
                    isError ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {output || '> Run your code to see the output here...'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        title="AI Code Review"
        maxWidth="max-w-4xl"
      >
        <AIReview
          code={code}
          language={selectedLanguage}
          onClose={closeReviewModal}
        />
      </Modal>
    </div>
  );
}

export default Code;