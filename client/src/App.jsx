// App.jsx
// Root component — owns all chat state and handles API communication
// Renders: Header → ChatWindow → InputBar in a full-height layout

import { useState, useCallback } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";

// ── Unique ID generator ────────────────────────────────────────
let _id = 0;
const uid = () => `msg_${++_id}_${Date.now()}`;

// ── Header component ───────────────────────────────────────────
function Header({ messageCount, onClear }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Left: logo + name */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{
            background: "linear-gradient(135deg, #1a2d4a, #0f1e33)",
            border: "1px solid rgba(240,165,0,0.35)",
            boxShadow: "0 0 16px rgba(240,165,0,0.12)",
            fontFamily: "var(--font-display)",
          }}
        >
          ✦
        </div>
        <div>
          <h1
            className="text-base font-bold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Claude
          </h1>
          {/* Online status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className="status-dot w-1.5 h-1.5 rounded-full block"
              style={{ background: "var(--online)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--online)", fontFamily: "var(--font-body)" }}
            >
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Right: message count + clear button */}
      <div className="flex items-center gap-3">
        {messageCount > 0 && (
          <span
            className="text-xs px-2 py-1 rounded-lg"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-bot)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            {messageCount} {messageCount === 1 ? "message" : "messages"}
          </span>
        )}
        {messageCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              color: "var(--text-secondary)",
              background: "transparent",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(248,113,113,0.4)";
              e.target.style.color = "var(--error)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            Clear chat
          </button>
        )}
      </div>
    </header>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  // All messages in the current session
  // Each message: { id, role: "user"|"assistant", content, timestamp, isError? }
  const [messages, setMessages] = useState([]);

  // Whether we're waiting for the API response
  const [isLoading, setIsLoading] = useState(false);

  // ── Send a message ───────────────────────────────────────────
  const handleSend = useCallback(
    async (text) => {
      if (isLoading) return;

      // 1. Append the user's message immediately (optimistic UI)
      const userMessage = {
        id: uid(),
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        // 2. Build the conversation history to send to the backend
        // Only include role + content (no internal UI fields)
        const apiMessages = updatedMessages.map(({ role, content }) => ({
          role,
          content,
        }));

        // 3. POST to our Express backend
        const { data } = await axios.post("/api/chat", {
          messages: apiMessages,
        });

        // 4. Append Claude's reply
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        // 5. On error: show an error message in the chat
        const errorText =
          err.response?.data?.error ||
          err.message ||
          "Something went wrong. Please try again.";

        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: `⚠️ ${errorText}`,
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  // ── Clear the chat ───────────────────────────────────────────
  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      className="bg-mesh flex flex-col"
      style={{ height: "100dvh", width: "100%" }}
    >
      {/* Fixed header */}
      <Header messageCount={messages.length} onClear={handleClear} />

      {/* Scrollable chat area — fills remaining height */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Sticky input bar */}
      <InputBar onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
