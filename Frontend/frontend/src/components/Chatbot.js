// Chatbot.js
import React, { useState, useRef } from "react";

const Chatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const toggleChat = () => setExpanded(!expanded);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = userInput.trim();
    if (!question) return;

    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);

    const botMsg = { role: "bot", content: "" };
    const msgIndex = messages.length + 1;
    setMessages((prev) => [...prev, botMsg]);

    try {
      const res = await fetch("http://localhost:5000/chatbot-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      const processChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n").filter(Boolean);

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const text = line.slice(6);

            for (let char of text) {
              fullText += char;
              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === msgIndex ? { ...msg, content: fullText } : msg
                )
              );
              outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
              await new Promise((res) => setTimeout(res, 1)); // slows down typing
            }
          }
        }
        processChunk(); // recurse
      };

      processChunk();
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === msgIndex
            ? { ...msg, content: "❌ Error streaming response." }
            : msg
        )
      );
      setLoading(false);
    }
  };

  const containerStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: expanded ? "360px" : "70px",
    height: expanded ? "440px" : "70px",
    backgroundColor: "#f7f8fc",
    border: "1px solid #ccc",
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
    zIndex: 9999,
    transition: "all 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyle = {
    backgroundColor: "#6a79f7",
    color: "#fff",
    padding: "12px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const headerHoverStyle = {
    ...headerStyle,
    backgroundColor: "#4a5bd4",
  };

  const bodyStyle = {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    fontSize: "14px",
    backgroundColor: "#fdfdff",
  };

  const inputStyle = {
    borderTop: "1px solid #ccc",
    padding: "10px",
    display: "flex",
    backgroundColor: "#fff",
  };

  const bubbleStyle = (role) => ({
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    background: role === "user"
      ? "linear-gradient(145deg, #d1dfff, #a5b9f8)"
      : "linear-gradient(145deg, #ece3f7, #d5c6ed)",
    color: "#333",
    padding: "8px 12px",
    margin: "6px 0",
    borderRadius: "18px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "80%",
    wordBreak: "break-word",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
  });

  const iconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "70px",
  cursor: "pointer",
  transition: "transform 0.2s",
  padding: "10px",
};

  return (
    <div style={containerStyle}>
      <div
        style={expanded ? headerStyle : iconStyle}
        onClick={toggleChat}
        onMouseEnter={(e) => {
          if (expanded) e.currentTarget.style.backgroundColor = "#4a5bd4";
        }}
        onMouseLeave={(e) => {
          if (expanded) e.currentTarget.style.backgroundColor = "#6a79f7";
        }}
      >
        {expanded ? "Ask JobBot 🤖" : (<img src="/chat-icon.png" alt="chat" style={{width: "60px", height: "60px", objectFit: "contain"}} />)}</div>

      {expanded && (
        <>
          <div style={bodyStyle} ref={outputRef}>
            {messages.map((msg, i) => (
              <div key={i} style={bubbleStyle(msg.role)}>
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={inputStyle}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                marginLeft: "8px",
                padding: "6px 12px",
                backgroundColor: "#6a79f7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot;
