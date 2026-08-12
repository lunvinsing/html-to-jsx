"use client";

import { useRef, useState, useEffect } from "react";

export default function CodeEditor({
  id,
  title,
  language = "html",
  value = "",
  onChange,
  readOnly = false,
  placeholder = "",
  error = null,
  actions = null,
  onClear,
}) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const [activeLine, setActiveLine] = useState(1);
  const [activeCol, setActiveCol] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  // Split text into lines for line number count
  const lines = value ? value.split("\n") : [""];
  const lineCount = lines.length;

  // Sync scroll position from textarea to line numbers gutter
  const handleScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Update cursor line and column position for VS Code status bar and active line highlighting
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const { selectionStart, value: text } = textareaRef.current;
    const textUpToCursor = text.slice(0, selectionStart);
    const lineIndex = textUpToCursor.split("\n").length;
    const lastNewlineIndex = textUpToCursor.lastIndexOf("\n");
    const colIndex = selectionStart - (lastNewlineIndex === -1 ? 0 : lastNewlineIndex + 1) + 1;

    setActiveLine(lineIndex);
    setActiveCol(colIndex);
  };

  // Handle Tab key to insert 2 spaces like VS Code
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (readOnly || !onChange) return;

      const textarea = e.target;
      const { selectionStart, selectionEnd, value: text } = textarea;
      const newValue = text.substring(0, selectionStart) + "  " + text.substring(selectionEnd);

      onChange(newValue);

      // Restore cursor position after state change
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 2;
          textareaRef.current.selectionEnd = selectionStart + 2;
          updateCursorPosition();
        }
      });
    }
  };

  // Keep gutter scrolled when content changes
  useEffect(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [value]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-[420px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 dark:focus-within:border-blue-400">
      {/* VS Code-style Editor Header / Tab Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-100 dark:bg-[#252526] border-b border-zinc-200 dark:border-zinc-800 select-none">
        {/* Tab */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded bg-white dark:bg-[#1e1e1e] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 shadow-xs">
            {language === "html" ? (
              <span className="text-orange-500 font-bold font-mono">&lt;/&gt;</span>
            ) : (
              <span className="text-cyan-400 font-bold font-mono">⚛</span>
            )}
            <span>{title}</span>
            {readOnly && (
              <span className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold">
                Read-only
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {actions}
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              title="Clear editor content"
              className="px-2 py-1 text-xs text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Editor Body: Gutter + Textarea */}
      <div className="relative flex flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e]">
        {/* VS Code Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="flex-none py-3 pl-2 pr-3 bg-zinc-50 dark:bg-[#1e1e1e] border-r border-zinc-200 dark:border-[#2d2d2d] overflow-hidden select-none font-mono text-xs text-right min-w-[3.5rem]"
          style={{ userSelect: "none" }}
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const lineNum = i + 1;
            const isActive = isFocused && activeLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`h-6 leading-6 transition-colors font-mono ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100 font-bold"
                    : "text-zinc-400 dark:text-[#858585]"
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative flex-1 h-full overflow-hidden">
          <textarea
            id={id}
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (onChange) onChange(e.target.value);
              updateCursorPosition();
            }}
            onScroll={handleScroll}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onSelect={updateCursorPosition}
            onFocus={() => {
              setIsFocused(true);
              updateCursorPosition();
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="w-full h-full py-3 px-3.5 bg-transparent font-mono text-sm leading-6 text-zinc-900 dark:text-[#d4d4d4] placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none resize-none overflow-auto whitespace-pre tab-2 selection:bg-blue-200 dark:selection:bg-[#264f78]"
            style={{
              tabSize: 2,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          />
        </div>
      </div>

      {/* Error Message if conversion failed */}
      {error && (
        <div className="px-3 py-2 text-xs bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-t border-red-200 dark:border-red-900 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* VS Code-style Status Bar Footer */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-[#181818] border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono select-none">
        <div className="flex items-center gap-3">
          <span>
            Ln {activeLine}, Col {activeCol}
          </span>
          <span>
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
          <span>{value.length} chars</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="uppercase">{language === "html" ? "HTML" : "JSX"}</span>
        </div>
      </div>
    </div>
  );
}
