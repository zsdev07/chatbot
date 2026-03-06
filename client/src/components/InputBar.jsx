// InputBar.jsx
// Sticky input area at the bottom of the chat
// - Textarea that grows with content (up to max height)
// - Send on click OR Enter key (Shift+Enter for newline)
// - Disabled while loading

import { useState, useRef, useEffect } from "react";

// ── Send Icon SVG ──────────────────────────────────────────────
function SendIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ── InputBar ───────────────────────────────────────────────────
export default function InputBar({ onSend, isLoading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Re-focus textarea after loading completes
  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  // Handle form submission
  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return; // Ignore empty input or mid-request
    onSend(trimmed);
    setValue(""); // Clear textarea after sending
  };

  // Enter = send, Shift+Enter = new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div
      className="px-4 pb-4 pt-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
          style={{
            background: "var(--bg-surface)",
            border: `1px solid ${canSend ? "rgba(240,165,0,0.3)" : "var(--border)"}`,
            boxShadow: canSend ? "0 0 20px rgba(240,165,0,0.05)" : "none",
          }}
        >
          {/* Textarea — auto-grows via CSS field-sizing */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Waiting for response…" : "Message…"}
            className="flex-1 bg-transparent outline-none text-sm leading-relaxed"
            style={{
              color: isLoading ? "var(--text-secondary)" : "var(--text-primary)",
              fontFamily: "var(--font-body)",
              caretColor: "var(--accent)",
              "::placeholder": { color: "var(--text-muted)" },
            }}
            rows={1}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="send-btn flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: canSend
                ? "var(--accent)"
                : "var(--bg-bot)",
              color: canSend ? "#000" : "var(--text-muted)",
              cursor: canSend ? "pointer" : "not-allowed",
              border: "none",
            }}
            aria-label="Send message"
          >
            <SendIcon size={15} />
          </button>
        </div>

        {/* Hint text */}
        <p
          className="text-center text-xs mt-2"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
