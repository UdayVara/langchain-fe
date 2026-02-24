"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, type: "assistant", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Create empty assistant message for streaming
    const assistantId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, type: "assistant", text: "" },
    ]);

    // Close previous stream if exists
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `http://localhost:5000/langchain/stream?prompt=${encodeURIComponent(input)}`
    );

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, text: msg.text + event.data }
            : msg
        )
      );
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

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
              {msg.text}
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
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm 
                 font-medium hover:bg-gray-800 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}