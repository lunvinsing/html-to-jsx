"use client"; // This component uses React hooks (useState), so it must run on the client

// Import the HTML-to-JSX converter library (default export = convert function)
import convert from "node-html-to-jsx";

import { useState } from "react";

export default function Home() {
  // State: the raw HTML the user types on the left
  const [htmlInput, setHtmlInput] = useState("");
  // State: the converted JSX shown on the right
  const [jsxOutput, setJsxOutput] = useState("");
  // State: whether "Copied!" feedback is currently shown on the copy button
  const [copied, setCopied] = useState(false);

  // Fires when the user clicks "Convert to JSX"
  const handleConvert = () => {
    try {
      // Use the library to convert the current HTML input into JSX
      setJsxOutput(convert(htmlInput));
    } catch (err) {
      // If conversion fails (invalid HTML, etc.), show the error in the JSX box
      setJsxOutput(`// Conversion error: ${err.message}`);
    }
  };

  // Fires when the user clicks "Copy"
  const handleCopy = async () => {
    if (!jsxOutput) return; // Nothing to copy
    try {
      // Copy the converted JSX to the clipboard
      await navigator.clipboard.writeText(jsxOutput);
      setCopied(true);
      // Reset the "Copied!" label after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="flex-1 flex flex-col p-6 gap-4 w-full max-w-6xl mx-auto">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-center">HTML to JSX Converter</h1>

      {/* Two-column grid: HTML on the left, JSX on the right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* ---- HTML input (left) ---- */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="html-input"
            className="text-sm font-semibold uppercase tracking-wide"
          >
            HTML
          </label>
          {/* Textarea where the user pastes their HTML */}
          <textarea
            id="html-input"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste your HTML here..."
            className="flex-1 min-h-75 w-full resize-y rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400"
          />
        </div>

        {/* ---- JSX output (right) ---- */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="jsx-input"
            className="text-sm font-semibold uppercase tracking-wide"
          >
            JSX
          </label>
          {/* Read-only textarea that displays the converted JSX */}
          <textarea
            id="jsx-input"
            value={jsxOutput}
            readOnly
            placeholder="Converted JSX will appear here..."
            className="flex-1 min-h-75 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* ---- Convert button ---- */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-offset-gray-900"
        >
          Convert to JSX
        </button>
      </div>
    </main>
  );
}
