import "./CreateAccount.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { all } from "axios";

function CreateAccountPage() {
  const navigate = useNavigate();

  // State for various reasons.
  const [userName, setUserName] = useState("");
  const [confirmUserName, setConfirmUserName] = useState("");

  const [displayConfirm, setDisplayConfirm] = useState(false);

  const [userNameEmpty, setUserNameEmpty] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const [notMatch, setNotMatch] = useState(false);

  const goToHome = async () => {
    if (userNameEmpty || confirmEmpty || notMatch) {
      return;
    }
    try {
      let docRef = doc(db, `user_info/${auth.currentUser?.uid}`);
      await updateDoc(docRef, {
        username: userName,
      });
    } catch (error) {
      console.log(error);
    }
    navigate("/home");
  };

  const handleRendering = () => {
    if (!displayConfirm) {
      setDisplayConfirm(true);
      return false;
    }
    if (confirmUserName !== userName) {
      console.error("usernames don't match!");
      setNotMatch(!notMatch);
      return false;
    } else {
      setNotMatch(false);
    }
    return true;
  };

  // check what inputs have been rendered when next button is pressed
  const nextPressed = () => {
    if (!displayConfirm) {
      checkInputs("username");
    } else {
      checkInputs("confirm");
      if (!userNameEmpty && !confirmEmpty && !notMatch) {
        goToHome();
      }
    }
  };

  //Deals with empty inputs and rendering next input filed
  const checkInputs = (from: string) => {
    if (from === "username") {
      if (userName === "") {
        setUserNameEmpty(true);
      } else {
        setUserNameEmpty(false);
        handleRendering();
      }
    }

    if (from === "confirm") {
      if (confirmUserName === "") {
        setConfirmEmpty(true);
        if (notMatch) {
          setNotMatch(false);
        }
      } else {
        setConfirmEmpty(false);
        // signUpWithEmailAndPassword();
        handleRendering();
      }
    }
  };

  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="signup-container">
        <div className="create-account-text">Add Username</div>

        {userNameEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter a user name</span>
          </div>
        )}

        {displayConfirm && notMatch && (
          <div className="popup">
            <span className="popup-text">Usernames do not match!</span>
          </div>
        )}

        <input
          type="username"
          id="username"
          name="username"
          placeholder="user name"
          className={`email-input ${
            userNameEmpty || notMatch ? "email-input-empty" : ""
          }`}
          onChange={(event) => {
            event.preventDefault();
            setUserName(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              checkInputs("username");
            }
          }}
        />

        {displayConfirm && confirmEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter a password</span>
          </div>
        )}

        {displayConfirm && notMatch && (
          <div className="popup">
            <span className="popup-text">Usernames do not match!</span>
          </div>
        )}

        {displayConfirm && (
          <input
            type="username"
            id="username"
            name="username"
            placeholder="confirm user name"
            className={`password-input ${
              confirmEmpty || notMatch ? "password-input-empty" : ""
            }`}
            onChange={(event) => {
              event.preventDefault();
              setConfirmUserName(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                checkInputs("confirm");
              }
            }}
          />
        )}

        <div className="next-box">
          <button className="next-btn" onClick={nextPressed}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
