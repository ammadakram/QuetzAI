import React, { useState } from "react";
import "./ChatPage.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { backend_root } from "../firebase-config";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const ChatPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get("path"); // Get 'path' query parameter

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const queryLLM = async () => {
    try {
      let temp_res = await axios.get(
        `${backend_root}/generate?path=${path}&query=${encodeURIComponent(
          query
        )}`
      );
      console.log("Received response from LLM: ", temp_res.data);
      if (temp_res.data.result === "") {
        return temp_res.data.error;
      }
      return temp_res.data.result;
    } catch (error) {
      return error;
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() !== "") {
      const newMessage: Message = {
        id: messages.length,
        text: query,
        sender: "user",
      };
      console.log(location.search); // For debugging
      setMessages([...messages, newMessage]);
      setQuery("");
      setResponse("processing");
      let temp_res = await queryLLM();
      simulateResponse(temp_res);
    }
  };

  const simulateResponse = (llm_response: string) => {
    const response: Message = {
      id: messages.length,
      text: `${llm_response}`,
      sender: "bot",
    };
    setMessages((prev) => [...prev, response]);
    setResponse("idle");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}-message`}>
            {message.text}
          </div>
        ))}
        {response === "processing" && (
          <div className="loading-message bot-message">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </div>
      <input
        type="text"
        className="user-input"
        placeholder="Ask me anything..."
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatPage;
