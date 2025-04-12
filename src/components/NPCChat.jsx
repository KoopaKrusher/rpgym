import { useState, useEffect, useRef } from "react";

export default function NPCChat() {
  const [messages, setMessages] = useState([
    { sender: "npc", text: "Ah… a new soul enters the gym. State your purpose, adventurer." }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const npcReply = data.reply || "…hmm. I have no words for that.";

      setMessages((prev) => [...prev, { sender: "npc", text: npcReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "npc", text: "The winds of error whisper... something broke." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-900 rounded-lg border border-gray-700">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user" ? "ml-auto bg-blue-600" : "mr-auto bg-gray-700"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
        {isThinking && (
          <div className="text-gray-400 text-sm italic">The NPC is thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-2 rounded-l"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-yellow-500 text-black px-4 py-2 rounded-r hover:bg-yellow-400"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
