// MessageBubble.jsx
// Renders a single chat message — user (right) or assistant (left)
// Supports basic markdown rendering via regex parsing

// ── Simple markdown → HTML converter ──────────────────────────
// Handles: bold, italic, inline code, code blocks, lists
function parseMarkdown(text) {
  return text
    // Code blocks (must be processed before inline code)
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered list items
    .replace(/^[-•]\s(.+)/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>")
    // Line breaks → paragraphs (split on double newline)
    .split(/\n\n+/)
    .map((block) =>
      block.startsWith("<ul>") || block.startsWith("<pre>")
        ? block
        : `<p>${block.replace(/\n/g, "<br/>")}</p>`
    )
    .join("");
}

// ── Timestamp formatter ────────────────────────────────────────
function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── MessageBubble ──────────────────────────────────────────────
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <div
      className={`flex items-end gap-3 message-enter ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar — only shown for assistant messages */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{
            background: "linear-gradient(135deg, #1a2d4a, #0f1e33)",
            border: "1px solid rgba(240,165,0,0.3)",
            boxShadow: "0 0 10px rgba(240,165,0,0.1)",
            fontFamily: "var(--font-display)",
          }}
        >
          ✦
        </div>
      )}

      {/* Bubble + timestamp */}
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-2xl rounded-br-sm"
              : "rounded-2xl rounded-bl-sm"
          }`}
          style={{
            background: isError
              ? "rgba(248,113,113,0.12)"
              : isUser
              ? "var(--bg-user)"
              : "var(--bg-bot)",
            border: isError
              ? "1px solid rgba(248,113,113,0.3)"
              : isUser
              ? "1px solid rgba(56,100,180,0.4)"
              : "1px solid var(--border)",
            color: isError ? "var(--error)" : "var(--text-primary)",
            fontFamily: "var(--font-body)",
            wordBreak: "break-word",
          }}
        >
          {isUser ? (
            // User messages: plain text (preserve newlines)
            <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
          ) : (
            // Assistant messages: render markdown
            <div
              className="message-content"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(message.content),
              }}
            />
          )}
        </div>

        {/* Timestamp */}
        <span
          className="text-xs px-1"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
