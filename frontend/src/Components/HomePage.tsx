import React, { MouseEventHandler, useState } from "react";
import { auth, backend_root } from "../firebase-config";
import { storage } from "../firebase-config";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import axios from "axios";
import "./HomePage.css";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

function HomePage() {
  // state to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // handler function for file input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // get first file from the input
    const file = event.target.files![0];
    // update selected file state
    setSelectedFile(file);
  };

  const addUserFileAndChat = async (filePath: string, id: string) => {
    try {
      const doc_ref = doc(db, "user_info", `${auth.currentUser?.uid}`);
      await updateDoc(doc_ref, {
        files: arrayUnion(filePath),
        chats: arrayUnion(id),
        chat_and_file: arrayUnion({ chat_id: id, file_path: filePath }),
      });
    } catch (error) {
      console.log("An error occurred in updating the user's records: ", error);
    }
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
      await uploadBytes(fileRef, selectedFile);
      let chat_id = crypto.randomUUID();
      console.log("File uploaded successfully.");
      let response = await axios.get(
        `${backend_root}/download?id=${chat_id}&path=${filePath}`
      );
      console.log("Received response from backend: ", response);
      await addUserFileAndChat(filePath, chat_id);
      navigate(`/chat?path=${filePath}`);
    } catch (error) {
      console.log(
        "An error occurred during file upload or download: \n",
        error
      );
    }
  };

  return (
    <div className="home-page">
      <div className="logo">
        <img src="./QuetzAI_logo.png" alt="Logo" />
      </div>

      <div className="main-page">
        <div className="document-upload">
          <input
            id="file-input"
            className="document-upload-input"
            type="file"
            onChange={handleChange} // Changed to the existing handleChange function for consistency
          />
          {/* Custom label that acts as the stylized input area */}
          <label htmlFor="file-input" className="document-upload-input-label">
            Upload your document here
          </label>
          <button className="document-upload-btn" onClick={handleSubmit}>
            Upload File
          </button>
        </div>

        {/*Div for displaying user's previous converstaions (implementation yet to be done)*/}
        <div className="recent-conversations">
          <div className="recent-conversation">
            <p>Recent Conversation 1</p>
          </div>
          <div className="recent-conversation">
            <p>Recent Conversation 2</p>
          </div>
          <div className="recent-conversation">
            <p>Recent Conversation 3</p>
          </div>
          <div className="recent-conversation">
            <p>Recent Conversation 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
