import React, { useEffect, useState } from "react";
import { auth, backend_root } from "../firebase-config";
import { storage } from "../firebase-config";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase-config";
import axios from "axios";
import "./HomePage.css";
import { doc, getDoc } from "firebase/firestore";

interface FileAndChat {
  chat_id: string;
  file_path: string;
  title: string;
}

function HomePage() {
  // state to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chats, setChats] = useState<FileAndChat[]>([]);
  const [fileNames, setFileNames] = useState([""]);
  const navigate = useNavigate();
  const chatsRef = doc(db, `user_info/${auth.currentUser?.uid}`);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const fetchChats = async () => {
    try {
      let chats_temp = await getDoc(chatsRef);
      if (!chats_temp.exists()) {
        console.log("Cannot fetch user data!");
        return;
      }

      const chatData = chats_temp.data()?.chat_and_file;
      if (chatData) {
        setChats(chatData);
        let fileNamesTemp = chatData.map((elem: any) => {
          let file_path: string = elem.file_path;
          let file_name = file_path.split("/").slice(-1, -1);
          return file_name;
        });
        setFileNames(fileNamesTemp);
      }
      setDataLoaded(true);
    } catch (error) {
      console.log("Could not fetch User data due to: ", error);
    }
  };

  const handleChatNavigation = async (chat_id: string, file_path: string) => {
    navigate("/chat", {
      state: { id: chat_id, path: file_path },
    });
  };

  // Load user data upon loading.
  useEffect(() => {
    fetchChats();
  }, []);

  // useEffect(() => {
  //   console.log(chats);
  // }, [chats]);

  // handler function for file input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // get first file from the input
    const file = event.target.files![0];
    // update selected file state
    setSelectedFile(file);
    console.log(selectedFile?.name);
  };

  // handler function for form submission
  const handleSubmit = async () => {
    // alert the user if no file is selected
    console.log("Inside handle submit!");
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    console.log("Proceeding with upload.");
    const filePath = `files/${auth.currentUser?.uid}/${selectedFile.name}`;
    const fileRef = ref(storage, filePath);

    // Cannot handle multiple files yet. Maybe try this later.
    try {
      setFileUploading(true);
      await uploadBytes(fileRef, selectedFile);
      let chat_id = crypto.randomUUID();
      console.log("File uploaded successfully.");
      let response = await axios.get(
        `${backend_root}/download?id=${chat_id}&path=${filePath}`
      );
      console.log("Received response from backend: ", response);
      navigate("/chat", {
        state: { id: chat_id, path: filePath },
      });
    } catch (error) {
      console.log(
        "An error occurred during file upload or download: \n",
        error
      );
    }
  };

  return (
    <div className="home">
      {!dataLoaded && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Hang on tight... We're fetching your data!</p>
        </div>
      )}
      {fileUploading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>We're studying your file... Give us a moment!</p>
        </div>
      )}

      {dataLoaded && !fileUploading && (
        <div className="home-page">
          <nav className="nav-bar">
            <Link to="/home" className="nav-link">
              Home
            </Link>
            <Link to="/folder" className="nav-link">
              Folder
            </Link>
          </nav>

          <div className="main-page">
            <div className="document-upload">
              <input
                id="file-input"
                className="document-upload-input"
                type="file"
                onChange={handleChange}
              />
              {/* Custom label that acts as the stylized input area */}
              {selectedFile ? (
                <label
                  htmlFor="file-input"
                  className="document-upload-input-label"
                >
                  {selectedFile.name}
                </label>
              ) : (
                <label
                  htmlFor="file-input"
                  className="document-upload-input-label"
                >
                  Upload document here
                </label>
              )}
              <button className="document-upload-btn" onClick={handleSubmit}>
                Upload file
              </button>
            </div>

            {/*Div for displaying user's previous converstaions (implementation yet to be done)*/}
            <div className="recent-conversations">
              {chats.map((chat) => {
                return (
                  <div
                    className="recent-conversation"
                    key={chat.chat_id}
                    onClick={() =>
                      handleChatNavigation(chat.chat_id, chat.file_path)
                    }
                  >
                    <p>{chat.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
