// import React, { useState, useRef, useEffect } from "react";
// import { sendMessageToAgent } from "../api/aws";

// interface Message {
//   sender: "user" | "agent";
//   text: string;
// }

// export default function BedrockChat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     setMessages((prev) => [...prev, { sender: "user", text: input }]);
//     setLoading(true);
//     const currentInput = input;
//     setInput("");

//     try {
//       const reply = await sendMessageToAgent(currentInput);
//       setMessages((prev) => [...prev, { sender: "agent", text: reply }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "agent", text: "Error contacting agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div className="w-full max-w-lg bg-white p-4 rounded shadow flex flex-col">
//       {/* Chat messages */}
//       <div className="h-80 overflow-y-auto border p-2 mb-4 flex flex-col gap-2">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded ${
//               m.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
//             }`}
//           >
//             <strong>{m.sender === "user" ? "You" : "Agent"}:</strong> {m.text}
//           </div>
//         ))}
//         {loading && (
//           <div className="text-gray-500 italic">Agent is typing...</div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input box */}
//       <div className="flex gap-2">
//         <input
//           className="flex-grow border p-2 rounded"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message..."
//           disabled={loading}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           disabled={loading || !input.trim()}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { sendMessageToAgent } from "../api/aws";

interface Message {
  sender: "user" | "agent";
  text: string;
}

export default function BedrockChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    console.log("💬 Sending user message:", currentInput);

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);
    setLoading(true);
    setInput("");

    try {
      const reply = await sendMessageToAgent(currentInput);
      console.log("💬 Agent reply received:", reply);

      setMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    } catch (err) {
      console.error("❌ Error contacting agent:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Error contacting agent." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full max-w-lg bg-white p-4 rounded shadow flex flex-col">
      {/* Chat messages */}
      <div className="h-80 overflow-y-auto border p-2 mb-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
            }`}
          >
            <strong>{m.sender === "user" ? "You" : "Agent"}:</strong> {m.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic">Agent is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          className="flex-grow border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}