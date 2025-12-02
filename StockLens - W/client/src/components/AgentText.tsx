import React, { useState } from "react";
import { sendMessageToAgent } from "../api/aws";

export default function BedrockChat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    setLoading(true);
    const reply = await sendMessageToAgent(input);
    setLoading(false);

    setMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-lg bg-white p-4 rounded shadow">
      <div className="h-80 overflow-y-auto border p-2 mb-4">
        {messages.map((m, i) => (
          <p key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
            <strong>{m.sender}:</strong> {m.text}
          </p>
        ))}
        {loading && <p className="text-gray-500">Agent is typing...</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-grow border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}