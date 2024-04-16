import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { backend_root } from "../firebase-config";
import { doc, arrayUnion, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ChatPage: React.FC = () => {
  const location = useLocation();
  const path = location.state.path; // Get file path
  const chat_id = location.state.id; // Get chat id

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("idle");
  const chatHistoryRef = doc(
    db,
    `user_chat_history/${auth.currentUser?.uid}/history/${chat_id}`
  );
  const docRef = doc(db, `user_info/${auth.currentUser?.uid}`);

  useEffect(() => {
    console.log("Fetching history!");
    fetchHistory();
  }, []);

  const addUserFileAndChat = async (
    filePath: string,
    id: string,
    title: string
  ) => {
    try {
      const doc_ref = doc(db, "user_info", `${auth.currentUser?.uid}`);
      const history_ref = doc(
        db,
        `user_chat_history/${auth.currentUser?.uid}/history/${id}`
      );
      await updateDoc(doc_ref, {
        files: arrayUnion(filePath),
        chats: arrayUnion(id),
        chat_and_file: arrayUnion({
          chat_id: chat_id,
          file_path: path,
          title: title,
        }),
      });
      await setDoc(history_ref, {
        chat: [],
      });
    } catch (error) {
      console.log("An error occurred in updating the user's records: ", error);
    }
  };

  const fetchHistory = async () => {
    try {
      let historyDoc = await getDoc(chatHistoryRef);
      if (!historyDoc.exists()) {
        console.log("New chat with no history!");
        return;
      }
      let history = historyDoc.data()?.chat;
      console.log("Acquired history: ", history);
      history = history.map((elem: any, index: any) => {
        let newMessage: Message;
        if (index % 2 === 0) {
          newMessage = {
            id: crypto.randomUUID(),
            text: elem,
            sender: "user",
          };
        } else {
          newMessage = {
            id: crypto.randomUUID(),
            text: elem,
            sender: "bot",
          };
        }
        return newMessage;
      });
      setMessages(history);
    } catch (error) {
      console.log("Error in fetching history: ", error);
    }
  };
  const updateChatHistory = async (query: string, response: string) => {
    try {
      await updateDoc(chatHistoryRef, {
        chat: arrayUnion(query, response),
      });
    } catch (error) {
      console.log("An error occurred in updating the user's records: ", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const queryLLM = async () => {
    console.log("Chat id is: ", chat_id);
    try {
      let temp_res = await axios.get(
        `${backend_root}/generate?id=${chat_id}&path=${path}&query=${encodeURIComponent(
          query
        )}`
      );
      console.log("Received response from LLM: ", temp_res.data);
      if (temp_res.data.result === "") {
        return temp_res.data.error;
      }
      if (temp_res.data.title !== "") {
        await addUserFileAndChat(path, chat_id, temp_res.data.title);
      }
      return temp_res.data.result;
    } catch (error) {
      console.log("Error occurred during generation: ", error);
      return error;
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() !== "") {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        text: query,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setQuery("");
      setResponse("processing");
      let temp_res = await queryLLM();
      updateChatHistory(newMessage.text, temp_res)
        .then(() => {
          console.log("Updated history successfully.");
        })
        .catch(() => {
          console.log("Error in updating history.");
        });
      console.log(temp_res.title);
      simulateResponse(temp_res);
    }
  };

  const simulateResponse = (llm_response: string) => {
    const response: Message = {
      id: crypto.randomUUID(),
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
