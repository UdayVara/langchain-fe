"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, type: "assistant", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || loading) return;

  const userMessage = { id: Date.now(), type: "user", text: input };
  const assistantId = Date.now() + 1;

  setMessages((prev) => [
    ...prev,
    userMessage,
    { id: assistantId, type: "assistant", text: "" },
  ]);

  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/llm-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();
    const responseContent = data?.response?.content;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId
          ? { ...msg, text: responseContent }
          : msg
      )
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }

  setInput("");
};
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.text ||
                (loading && msg.type === "assistant" ? (
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </span>
                ) : null)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSend} className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                 resize-none focus:outline-none focus:ring-2 
                 focus:ring-gray-900 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
