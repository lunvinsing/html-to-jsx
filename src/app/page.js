"use client";

import { useState } from "react";
import convert from "node-html-to-jsx";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  const [htmlInput, setHtmlInput] = useState("");
  const [jsxOutput, setJsxOutput] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fires only when the user clicks "Convert"
  const handleConvert = () => {
    if (!htmlInput || !htmlInput.trim()) {
      setJsxOutput("");
      setError(null);
      return;
    }

    try {
      const result = convert(htmlInput);
      setJsxOutput(result);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to convert HTML to JSX");
    }
  };

  const handleCopy = async () => {
    if (!jsxOutput) return;
    try {
      await navigator.clipboard.writeText(jsxOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClearHtml = () => {
    setHtmlInput("");
    setJsxOutput("");
    setError(null);
  };

  return (
    <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-5 w-full max-w-7xl mx-auto">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              HTML to JSX Converter
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleConvert}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md shadow-xs transition-colors active:scale-95"
          >
            <span>Convert to JSX</span>
            <kbd className="hidden sm:inline-block px-1 py-0.5 text-[10px] bg-blue-700 dark:bg-blue-600 rounded font-mono">
              ↵
            </kbd>
          </button>
        </div>
      </header>

      {/* Two-column Code Editors with VS Code Line Numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[500px]">
        {/* HTML Input Editor */}
        <div className="flex flex-col h-full min-h-[400px]">
          <CodeEditor
            id="html-input"
            title="index.html"
            language="html"
            value={htmlInput}
            onChange={setHtmlInput}
            placeholder="<!-- Paste or type your HTML here... -->"
            onClear={handleClearHtml}
          />
        </div>

        {/* JSX Output Editor */}
        <div className="flex flex-col h-full min-h-[400px]">
          <CodeEditor
            id="jsx-output"
            title="Component.jsx"
            language="jsx"
            value={jsxOutput}
            readOnly={true}
            placeholder="// Converted JSX will appear here..."
            error={error}
            actions={
              <button
                type="button"
                onClick={handleCopy}
                disabled={!jsxOutput}
                title="Copy JSX code to clipboard"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  copied
                    ? "bg-emerald-600 text-white dark:bg-emerald-500"
                    : "text-zinc-700 dark:text-zinc-200 bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 2H9a3 3 0 01-3-2z" />
                    </svg>
                    <span>Copy JSX</span>
                  </>
                )}
              </button>
            }
          />
        </div>
      </div>
    </main>
  );
}
