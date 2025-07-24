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

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language] || '');
  };

  const getCurrentLanguage = () => {
    const lang = languageOptions.find(lang => lang.value === selectedLanguage);
    return lang ? lang.prismLang : languages.cpp; // Default to cpp instead of js
  };

  const runCode = () => {
    const input = '';
    const extension = selectedLanguage;
    const content = code;
    fetch('http://localhost:3000/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ extension, content, input }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOutput(data.output);
        } else {
          setOutput(`Error: ${data.error}`);
        }
      })
      .catch(error => {
        console.error('Error running code:', error);
        setOutput('Error running code. Please check the console for details.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Code Editor</h1>
            <p className="text-gray-300">Write, edit, and test your code online</p>
          </div>


          {/* Code Editor */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg overflow-hidden">
            <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-3">
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
              <div className="flex gap-3">
                <button
                  onClick={() => setCode('')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleLanguageChange(selectedLanguage)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Template
                </button>
                <button
                  onClick={runCode}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Run Code
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
                    return code; // Return unhighlighted code if there's an error
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
                textareaprops={{
                  style: {
                    outline: 'light',
                    resize: 'none',
                  }
                }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="mt-6 bg-gray-800/50 backdrop-blur-lg border border-gray-600/50 rounded-lg">
            <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600/50">
              <span className="text-white font-medium">Output</span>
            </div>
            <div className="p-4 min-h-[150px]">
              <pre className="text-green-400 font-mono text-sm">
                {output || '> Run your code to see the output here.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Code;