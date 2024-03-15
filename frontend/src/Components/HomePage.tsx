import React, { useState } from 'react';
import './HomePage.css';

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
    // trigger a click event on the file input element
    document.getElementById('file-input')?.click();
  };

  // handler function for form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // alert the user if no file is selected
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    // create a new FormData object and append the selected file to it
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formData.append('file', selectedFile);

    // file handling to backend not implemented yet.

    // fetch('/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error(error));
  };

  return (
    <div className="home-page">
      <div className="logo">
        <img src="./QuetzAI_logo.png" alt="Logo" />
      </div>

      <div className="main-page">
        <div className="document-upload">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="file-input"
              className="file-upload-box"
              onClick={handleBoxClick}
            >
              <input
                id="file-input"
                type="file"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <span>upload or drag document here</span>
            </label>
          </form>
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
