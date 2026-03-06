// ChatWindow.jsx
// The scrollable area that displays all messages and the typing indicator
// Auto-scrolls to the latest message whenever messages change

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

// ── Empty state shown before any messages ──────────────────────
function EmptyState() {
  const suggestions = [
    "What can you help me with?",
    "Explain quantum computing simply",
    "Write a haiku about the ocean",
    "Debug this: for i in range(10) print(i)",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: "linear-gradient(135deg, #1a2d4a, #0f1e33)",
            border: "1px solid rgba(240,165,0,0.3)",
            boxShadow: "0 0 40px rgba(240,165,0,0.08)",
            fontFamily: "var(--font-display)",
          }}
        >
          ✦
        </div>
        <div className="text-center">
          <h2
            className="text-xl font-bold mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            How can I help?
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Ask me anything — I'm here to assist.
          </p>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s}
            className="text-xs px-3 py-2 rounded-full transition-all duration-200"
            style={{
              background: "var(--bg-bot)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              cursor: "default", // purely decorative — could wire up onClick
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ChatWindow ─────────────────────────────────────────────────
export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages update or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {/* Render each message bubble */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator while API is in-flight */}
          {isLoading && <TypingIndicator />}

          {/* Invisible sentinel element — scroll target */}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
