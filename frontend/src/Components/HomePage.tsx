import React, { useState } from 'react';
import './HomePage.css';

function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]; // Optional chaining to handle null
    setSelectedFile(file);
  };

  const handleBoxClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    // Send the file to your backend using FormData or Fetch API:
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formData.append('file', selectedFile);

    // Replace with your backend URL and handle the response appropriately
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="home-page">
      <div className="logo">
        <img src="./QuetzAI_logo.png" alt="Logo" />
      </div>

      <div className="main-page">
        {/* <div className="document-upload">
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange} />
            <button type="submit">upload document here</button>
          </form>
        </div> */}

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
