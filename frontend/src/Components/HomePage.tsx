import React, { MouseEventHandler, useState } from "react";
import { auth } from "../firebase-config";
import { storage } from "../firebase-config";
import { ref, uploadBytes } from "firebase/storage";
import "./HomePage.css";
import { upload } from "@testing-library/user-event/dist/upload";
import { error } from "console";

function HomePage() {
  // state to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // handler function for file input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // get first file from the inpu
    const file = event.target.files![0];
    // update selected file state
    setSelectedFile(file);
  };

  // handler function for when users click file upload box
  const handleBoxClick = () => {
    console.log(auth.currentUser?.uid);
    // trigger a click event on the file input element
    document.getElementById("file-input")?.click();
  };

  // handler function for form submission
  const handleSubmit = () => {
    // alert the user if no file is selected
    console.log("Inside handle submit!");
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    console.log("Proceeding with upload.");

    // create a new FormData object and append the selected file to it
    const fileRef = ref(
      storage,
      `files/${auth.currentUser?.uid}/${selectedFile.name}`
    );

    // Cannot handle multiple files yet. Maybe try this later.
    console.log("Attempting to upload file.");
    uploadBytes(fileRef, selectedFile)
      .then(() => {
        console.log("File uploaded successfully.");
      })
      .catch((error) => {
        console.log("An error occurred during file upload: \n", error);
      });
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
