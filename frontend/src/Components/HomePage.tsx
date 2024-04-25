import React, { useEffect, useState } from 'react';
import { auth, backend_root } from '../firebase-config';
import { storage } from '../firebase-config';
import { ref, uploadBytes } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import axios from 'axios';
import './HomePage.css';
import { doc, getDoc } from 'firebase/firestore';
import SideBar from './SideBar';
import { Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  RightCircleOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

interface FileAndChat {
  chat_id: string;
  file_path: string;
  title: string;
}

function HomePage() {
  // state to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chats, setChats] = useState<FileAndChat[]>([]);
  const [fileNames, setFileNames] = useState(['']);
  const navigate = useNavigate();
  const chatsRef = doc(db, `user_info/${auth.currentUser?.uid}`);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [numRecent, setNumRecent] = useState(0);

  const fetchChats = async () => {
    try {
      let chats_temp = await getDoc(chatsRef);
      if (!chats_temp.exists()) {
        console.log('Cannot fetch user data!');
        return;
      }

      const chatData = chats_temp.data()?.chat_and_file;
      if (chatData) {
        setChats(chatData);
        let fileNamesTemp = chatData.map((elem: any) => {
          let file_path: string = elem.file_path;
          let file_name = file_path.split('/').slice(-1, -1);
          return file_name;
        });
        setFileNames(fileNamesTemp);
      }
      setDataLoaded(true);
    } catch (error) {
      console.log('Could not fetch User data due to: ', error);
    }
  };

  const handleChatNavigation = async (chat_id: string, file_path: string) => {
    navigate('/chat', {
      state: { id: chat_id, path: file_path },
    });
  };

  // Load user data upon loading.
  useEffect(() => {
    fetchChats();
  }, []);

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
    console.log('Inside handle submit!');
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    console.log('Proceeding with upload.');
    const filePath = `files/${auth.currentUser?.uid}/${selectedFile.name}`;
    const fileRef = ref(storage, filePath);

    // Cannot handle multiple files yet. Maybe try this later.
    try {
      setFileUploading(true);
      await uploadBytes(fileRef, selectedFile);
      let chat_id = crypto.randomUUID();
      console.log('File uploaded successfully.');
      let response = await axios.get(
        `${backend_root}/download?id=${chat_id}&path=${filePath}`
      );
      console.log('Received response from backend: ', response);
      navigate('/chat', {
        state: { id: chat_id, path: filePath },
      });
    } catch (error) {
      console.log(
        'An error occurred during file upload or download: \n',
        error
      );
    }
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <div className="dropdown-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="dropdown-icon"
          >
            <path
              d="M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            ></path>
            <circle
              cx="12"
              cy="12"
              r="2.5"
              stroke="currentColor"
              stroke-width="2"
            ></circle>
          </svg>{' '}
          Settings
        </div>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className="dropdown-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="dropdown-icon"
          >
            <path
              d="M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H11"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            ></path>
            <path
              d="M20 12H11M20 12L16 16M20 12L16 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          Log out
        </div>
      ),
      key: '3',
    },
  ];

  return (
    <div className="home">
      {!dataLoaded && (
        <div className="loading-screen">
          {/* <div className="spinner"></div> */}
          <LoadingOutlined className="spinner" />
          <p>Hang on tight... We're fetching your data!</p>
        </div>
      )}

      {fileUploading && (
        <div className="loading-screen">
          <LoadingOutlined className="spinner" />
          {/* <div className="spinner"></div> */}
          <p>We're studying your file... Give us a moment!</p>
        </div>
      )}

      {dataLoaded && !fileUploading && (
        <div className="home-page">
          <div className="header-home">
            <SideBar />
            <div className="logo-home">
              <img src="./QuetzAI_logo.png" alt="Logo" />
            </div>
            <Dropdown
              className="user-dropdown"
              menu={{ items }}
              trigger={['click']}
            >
              <Tooltip placement="left" title={<span>Account</span>}>
                <UserOutlined className="user-home" />
              </Tooltip>
            </Dropdown>
          </div>

          <div className="main-page">
            <div className="document-upload">
              <input
                id="file-input"
                className="document-upload-input"
                type="file"
                accept=".pdf"
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
              {chats.length > 0 ? (
                chats.slice(Math.max(chats.length - 4, 0)).map((chat) => (
                  <div
                    className="recent-conversation"
                    key={chat.chat_id}
                    onClick={() =>
                      handleChatNavigation(chat.chat_id, chat.file_path)
                    }
                  >
                    <div className="text-bubble">
                      <p>
                        {chat.title.length > 30
                          ? chat.title.slice(0, 30) + '...'
                          : chat.title}
                      </p>
                    </div>
                    <div className="go-to-chat">
                      Go to chat
                      <RightCircleOutlined className="right-arrow" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-conversations">No recent conversations!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
