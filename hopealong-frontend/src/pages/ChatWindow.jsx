import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

// Only create the socket once
const socket = io("http://localhost:5000", { withCredentials: true });

const ChatWindow = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch past messages on mount
  useEffect(() => {
    if (!roomId) return;
    fetch(`http://localhost:5000/api/chat/${roomId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setMessages(data || []));
  }, [roomId]);

  // Register user and join room, handle real-time messages
  useEffect(() => {
    if (!user?.id || !roomId) return;
    socket.emit("register", user.id);
    socket.emit("joinRoom", roomId);

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("message", handleMessage);
    };
  }, [user?.id, roomId]);

  // Socket connection event
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user?.id) {
      return;
    }
    socket.emit("sendMessage", {
      roomId,
      tripModel: "Ride",
      sender: user.name,
      senderId: user.id,
      text: input,
      createdAt: new Date().toISOString(),
    });
    setInput("");
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg flex flex-col h-[80vh] border border-gray-200">
      {/* Header */}
      <div className="py-4 px-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-t-xl">
        <div className="text-white font-bold text-lg">Chat Room</div>
        <div className="text-indigo-100 text-xs">{roomId}</div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.map((msg, idx) => {
          const isMe =
            (msg.sender?._id && msg.sender?._id === user.id) ||
            (msg.senderId && msg.senderId === user.id);
          return (
            <div
              key={msg._id || idx}
              className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 shadow-md max-w-[70%] break-words
                  ${isMe
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                  }`}
              >
                <div className="font-semibold text-xs mb-1 opacity-70">
                  {isMe ? "You" : msg.sender?.name || msg.sender || "Unknown"}
                </div>
                <div className="text-base">{msg.message || msg.text}</div>
                <div className="text-[10px] text-gray-200 mt-1 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-gray-200 bg-white">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;