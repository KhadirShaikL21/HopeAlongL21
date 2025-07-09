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
  const [ride, setRide] = useState(null);
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

  // Fetch ride or delivery details for sidebar using tripId and tripModel from chat room (not messages)
  useEffect(() => {
    if (!roomId) return;
    fetch(`http://localhost:5000/api/chatroom/${roomId}`, { credentials: "include" })
      .then(res => res.json())
      .then(room => {
        if (!room || !room.tripId || !room.tripModel) {
          setRide({ msg: "No trip ID/model found for this chat room." });
          return;
        }
        const { tripId, tripModel } = room;
        if (tripModel === "Ride") {
          fetch(`http://localhost:5000/api/rides/${tripId}`, { credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(data => setRide(data?.ride || { msg: "Ride not found for this chat." }));
        } else if (tripModel === "GoodsDelivery") {
          fetch(`http://localhost:5000/api/goods/${tripId}`, { credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(data => setRide(data?.goods || { msg: "Goods delivery not found for this chat." }));
        } else {
          setRide({ msg: `Unknown trip model: ${tripModel}` });
        }
      });
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
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl flex h-[85vh] border border-gray-100 overflow-hidden">
      {/* Sidebar (Professional Hero/Info Section) */}
      <div className="hidden md:flex flex-col justify-between w-1/3 bg-gradient-to-br from-indigo-700 via-indigo-500 to-cyan-500 p-10 border-r border-indigo-200 shadow-lg relative">
        <div>
          <div className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">HopeAlong Chat</div>
          <div className="text-lg text-indigo-100 mb-4 font-medium">Your trusted travel companion for safe, social, and seamless journeys.</div>
          <ul className="text-indigo-50 text-base space-y-1 mb-4 pl-4 list-disc">
            <li>Real-time chat with your ride partners and captains</li>
            <li>Coordinate pickups, drop-offs, and special requests</li>
            <li>All conversations are private and secure</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <img src="/vite.svg" alt="HopeAlong Logo" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-xl rounded-full border-4 border-white/30 bg-white/10 mb-4" />
          <div className="text-xs text-indigo-200 text-center">Thank you for choosing HopeAlong.<br/>Travel together, travel better.</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-700 opacity-60 rounded-b-3xl" />
      </div>
      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Room Header */}
        <div className="py-3 px-6 border-b border-gray-100 flex items-center justify-between bg-white/90">
          <div className="text-indigo-700 font-bold text-lg tracking-wide flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Chat Room
          </div>
          <div className="text-indigo-400 text-xs font-mono">Room ID: {roomId}</div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          {messages.map((msg, idx) => {
            const isMe =
              (msg.sender?._id && msg.sender?._id === user.id) ||
              (msg.senderId && msg.senderId === user.id);
            return (
              <div
                key={msg._id || idx}
                className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-5 py-3 shadow-lg max-w-[65%] break-words transition-all duration-200
                    ${isMe
                      ? "bg-indigo-600 text-white rounded-br-none border-2 border-indigo-400"
                      : "bg-white text-gray-900 border-2 border-indigo-100 rounded-bl-none"
                    }`}
                >
                  <div className="font-semibold text-xs mb-1 opacity-80 flex items-center gap-1">
                    {isMe ? <span className="text-indigo-200">You</span> : <span className="text-indigo-700">{msg.sender?.name || msg.sender || "Unknown"}</span>}
                  </div>
                  <div className="text-base leading-relaxed">{msg.message || msg.text}</div>
                  <div className="text-[10px] text-indigo-200 mt-1 text-right">
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
        <form onSubmit={sendMessage} className="flex gap-2 p-5 border-t border-gray-100 bg-white/90">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border-2 border-indigo-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white shadow-sm"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;