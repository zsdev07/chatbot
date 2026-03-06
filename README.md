# ✦ AI Chatbot

A full-stack AI chat application built with React + Vite (frontend) and Node.js + Express (backend), powered by Anthropic's Claude API.

---

## 🚀 Quick Start

### 1. Install server dependencies
```bash
cd server
npm install
```

### 2. Add your API key
Edit `server/.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
```
Get a key at: https://console.anthropic.com

### 3. Start the backend
```bash
cd server
node index.js
# → Server running at http://localhost:3001
```

### 4. Install client dependencies
```bash
cd client
npm install
```

### 5. Start the frontend
```bash
cd client
npm run dev
# → App running at http://localhost:5173
```

---

## 📁 Project Structure

```
ai-chatbot/
├── server/
│   ├── index.js          ← Express API (POST /api/chat)
│   ├── .env              ← ANTHROPIC_API_KEY (edit this!)
│   └── package.json
└── client/
    ├── src/
    │   ├── App.jsx              ← Root component + state management
    │   ├── index.css            ← Global styles + animations
    │   └── components/
    │       ├── ChatWindow.jsx   ← Scrollable message feed
    │       ├── MessageBubble.jsx ← Individual message display
    │       ├── InputBar.jsx     ← Textarea + send button
    │       └── TypingIndicator.jsx ← Animated loading dots
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ✨ Features

- Multi-turn conversation with full context
- Typing indicator while waiting for response
- Markdown rendering (bold, italic, code, lists)
- Auto-scroll to latest message
- Enter to send, Shift+Enter for newline
- Clear chat button
- Error handling with user-friendly messages
- Responsive — works on mobile and desktop

---

## 🔧 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18 + Vite + Tailwind v4 |
| Backend  | Node.js + Express             |
| AI       | Anthropic Claude (Sonnet 4)   |
| HTTP     | Axios                         |
