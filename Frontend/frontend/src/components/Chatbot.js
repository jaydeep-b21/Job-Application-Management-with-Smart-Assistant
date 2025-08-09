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
              await new Promise((res) => setTimeout(res, 1));
            }
          }
        }
        processChunk();
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
    bottom: "24px",
    right: "24px",
    width: expanded ? "400px" : "80px",
    height: expanded ? "520px" : "80px",
    background: expanded 
      ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(211,175,240,0.15) 100%)"
      : "linear-gradient(135deg, #D3AFF0 0%, #B794D1 50%, #9B7AB8 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(211,175,240,0.3)",
    borderRadius: expanded ? "24px" : "50%",
    boxShadow: expanded 
      ? "0 25px 50px rgba(211,175,240,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
      : "0 15px 35px rgba(211,175,240,0.6), 0 5px 15px rgba(0,0,0,0.12)",
    zIndex: 9999,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transform: expanded ? "scale(1)" : "scale(1)",
  };

  const premiumHeaderStyle = {
    background: "linear-gradient(135deg, #D3AFF0 0%, #C49EE8 50%, #B794D1 100%)",
    color: "#fff",
    padding: "20px 24px",
    borderRadius: "24px 24px 0 0",
    position: "relative",
    boxShadow: "0 4px 20px rgba(211,175,240,0.3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const premiumTitleStyle = {
    fontFamily: "'Playfair Display', 'Times New Roman', serif",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.2em",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    background: "linear-gradient(45deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const minimizeButtonStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    lineHeight: "1",
    paddingLeft: "1px",           
    fontFamily: "monospace",    
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    userSelect: "none",
  };

  const bodyStyle = {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    fontSize: "15px",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(10px)",
  };

  const inputContainerStyle = {
    padding: "20px 24px 24px",
    background: "rgba(255,255,255,0.05)",
    borderTop: "1px solid rgba(211,175,240,0.2)",
    backdropFilter: "blur(10px)",
  };

  const inputFormStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
  };

  const inputFieldStyle = {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "20px",
    border: "2px solid rgba(211,175,240,0.3)",
    fontSize: "15px",
    background: "rgba(255,255,255,0.9)",
    color: "#333",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const sendButtonStyle = {
    padding: "14px 20px",
    background: loading 
      ? "linear-gradient(135deg, #D3AFF0 0%, #B794D1 100%)"
      : "linear-gradient(135deg, #D3AFF0 0%, #C49EE8 50%, #B794D1 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(211,175,240,0.4)",
    minWidth: "70px",
    opacity: loading ? 0.7 : 1,
  };

  const bubbleStyle = (role) => ({
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    background: role === "user"
      ? "linear-gradient(135deg, #D3AFF0 0%, #C49EE8 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
    color: role === "user" ? "#fff" : "#374151",
    padding: "14px 18px",
    margin: "8px 0",
    borderRadius: role === "user" ? "20px 20px 8px 20px" : "20px 20px 20px 8px",
    boxShadow: role === "user" 
      ? "0 4px 15px rgba(211,175,240,0.3)"
      : "0 4px 15px rgba(0,0,0,0.08)",
    maxWidth: "85%",
    wordBreak: "break-word",
    fontSize: "15px",
    lineHeight: "1.5",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    border: role === "user" ? "none" : "1px solid rgba(0,0,0,0.05)",
  });

  const floatingButtonStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "28px",
    color: "#fff",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transform: "scale(1)",
  };

  const loadingDots = {
    display: "inline-flex",
    gap: "2px",
  };

  const dotStyle = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#fff",
    animation: "pulse 1.5s infinite",
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
          @keyframes pulse {
            0%, 60%, 100% { opacity: 1; transform: scale(1); }
            30% { opacity: 0.7; transform: scale(1.1); }
          }
        `}
      </style>
      <div style={containerStyle}>
        {expanded ? (
          <>
            <div style={premiumHeaderStyle}>
              <div style={premiumTitleStyle}>P R E M I U M</div>
              <div
                style={minimizeButtonStyle}
                onClick={toggleChat}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.color = "#c0392b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                ×
              </div>
            </div>

            <div style={bodyStyle} ref={outputRef}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: "center",
                  color: "#9CA3AF",
                  fontSize: "16px",
                  marginTop: "40px",
                  fontStyle: "italic"
                }}>
                  Welcome to Premium Support 💎
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={bubbleStyle(msg.role)}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "4px",
                    opacity: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {msg.role === "user" ? "You" : "Premium AI"}
                  </div>
                  {msg.content}
                </div>
              ))}
            </div>

            <div style={inputContainerStyle}>
              <div style={inputFormStyle}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask your premium question..."
                  style={inputFieldStyle}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleSubmit(e);
                    }
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#D3AFF0";
                    e.target.style.boxShadow = "0 0 0 3px rgba(211,175,240,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(211,175,240,0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={sendButtonStyle}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(211,175,240,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(211,175,240,0.4)";
                    }
                  }}
                >
                  {loading ? (
                    <div style={loadingDots}>
                      <div style={{...dotStyle, animationDelay: "0s"}}></div>
                      <div style={{...dotStyle, animationDelay: "0.2s"}}></div>
                      <div style={{...dotStyle, animationDelay: "0.4s"}}></div>
                    </div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={floatingButtonStyle}
            onClick={toggleChat}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(211,175,240,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(211,175,240,0.6)";
            }}
          >
            <img 
              src="/chat-icon.png" 
              alt="chat" 
              style={{
                width: "50px", 
                height: "50px", 
                objectFit: "contain",
                transition: "all 0.3s ease"
              }} 
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;