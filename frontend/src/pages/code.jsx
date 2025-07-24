import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

// Import languages in the correct dependency order
import 'prismjs/components/prism-clike';    // C-like must come first (base for many languages)
import 'prismjs/components/prism-c';        // C comes next
import 'prismjs/components/prism-cpp';      // C++ depends on C
import 'prismjs/components/prism-java';     // Java depends on clike
import 'prismjs/components/prism-python';   // Python is independent

// Import the dark theme
import 'prismjs/themes/prism-dark.css';

function Code() {
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);

  const languageOptions = [
    { value: 'python', label: 'Python', prismLang: languages.python },
    { value: 'java', label: 'Java', prismLang: languages.java },
    { value: 'cpp', label: 'C++', prismLang: languages.cpp },
    { value: 'c', label: 'C', prismLang: languages.c },
  ];

  const codeTemplates = {
    python: `def hello_world():\n    print("Hello, World!")\n\nhello_world()`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  };

  const inputTemplates = {
    python: `# Example for input:\n# name = input()\n# print(f"Hello, {name}!")`,
    java: `// Example for input:\n// Scanner sc = new Scanner(System.in);\n// String name = sc.nextLine();\n// System.out.println("Hello, " + name + "!");`,
    cpp: `// Example for input:\n// string name;\n// cin >> name;\n// cout << "Hello, " << name << "!" << endl;`,
    c: `// Example for input:\n// char name[100];\n// scanf("%s", name);\n// printf("Hello, %s!\\n", name);`,
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language] || '');
    setOutput('');
    setIsError(false);
  };

  const getCurrentLanguage = () => {
    const lang = languageOptions.find(lang => lang.value === selectedLanguage);
    return lang ? lang.prismLang : languages.cpp;
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
      const response = await fetch('http://localhost:3000/compile', {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Code Editor</h1>
            <p className="text-gray-300">Write, edit, and test your code online</p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
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
                    <div className="flex gap-2">
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
                    value={code}
                    onValueChange={setCode}
                    highlight={(code) => {
                      try {
                        return highlight(code, getCurrentLanguage(), selectedLanguage);
                      } catch (error) {
                        console.error('Highlight error:', error);
                        return code;
                      }
                    }}
                    className="min-h-[400px] focus:outline-none"
                    style={{
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                      fontSize: 14,
                      lineHeight: 1.6,
                      background: 'transparent',
                      color: '#ffffff',
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
                    placeholder={inputTemplates[selectedLanguage] || "Enter test input here...\n\nExample:\n5\nHello World"}
                    className="w-full h-32 bg-gray-900/50 text-white border border-gray-600/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                    style={{
                      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                    }}
                  />
                  <div className="mt-2 text-xs text-gray-400">
                    💡 Tip: Each line will be sent as separate input to your program
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Output</span>
                    {isError && (
                      <span className="text-red-400 text-xs">❌ Error</span>
                    )}
                    {!isError && output && output !== '> Running code...' && (
                      <span className="text-green-400 text-xs">✅ Success</span>
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

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setInput('')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    Clear Input
                  </button>
                  <button
                    onClick={() => setOutput('')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    Clear Output
                  </button>
                  <button
                    onClick={() => {
                      const sampleInputs = {
                        python: "Alice\n25",
                        java: "World\n42",
                        cpp: "CodeEditor\n100",
                        c: "Test\n123"
                      };
                      setInput(sampleInputs[selectedLanguage] || "Sample\n123");
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    Load Sample Input
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Code;