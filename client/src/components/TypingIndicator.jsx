// TypingIndicator.jsx
// Animated "bot is thinking" indicator shown while API call is in-flight

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 message-enter">
      {/* Bot avatar — matches MessageBubble bot avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={{
          background: "linear-gradient(135deg, #1a2d4a, #0f1e33)",
          border: "1px solid rgba(240,165,0,0.3)",
          boxShadow: "0 0 10px rgba(240,165,0,0.1)",
        }}
      >
        ✦
      </div>

      {/* Bubble with bouncing dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: "var(--bg-bot)",
          border: "1px solid var(--border)",
        }}
      >
        <span
          className="dot-1 w-2 h-2 rounded-full block"
          style={{ background: "var(--accent)" }}
        />
        <span
          className="dot-2 w-2 h-2 rounded-full block"
          style={{ background: "var(--accent)" }}
        />
        <span
          className="dot-3 w-2 h-2 rounded-full block"
          style={{ background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
