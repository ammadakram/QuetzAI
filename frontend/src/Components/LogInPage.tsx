import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
import "./LogInPage.css";

function LogInPage() {
  const navigate = useNavigate();
  // Creating a GoogleAuthProvider instance from firebase
  const provider = new GoogleAuthProvider();
  // State for entered email
  const [enteredEmail, setEnteredEmail] = useState("");
  // State for password
  const [password, setPassword] = useState("");
  // State to control display of password input
  const [displayPass, setDisplayPass] = useState(false);

  // sign in existing user with email and password
  const signInExistingUser = async () => {
    try {
      // Signing in with email and password
      await signInWithEmailAndPassword(auth, enteredEmail, password);
      navigate("/home");
    } catch (err) {
      // Logging any errors that occur during sign-in
      console.error(err);
    }
  };

  // sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Signing in with Google using popup
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      // Logging any errors that occur during sign-in with Google
      console.error(err);
    }
  };

  // handle key press events
  const keyPressed = (
    event: React.KeyboardEvent<HTMLInputElement>,
    source: string
  ) => {
    if (event.key === "Enter" && source === "password") {
      // Call signInExistingUser function if Enter key pressed in password input
      signInExistingUser();
    } else if (event.key === "Enter" && source === "email") {
      // Display password input if Enter key pressed in email input
      setDisplayPass(true);
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="login-container">
        <section className="container-wrapper">
          <div className="title-box">
            <h1 className="title-text">Welcome back</h1>
          </div>
          <div className="email-wrapper">
            <input
              className="email-input"
              type="email"
              name="email"
              placeholder="email address"
              onChange={(event) => {
                event.preventDefault();
                setEnteredEmail(event.target.value);
              }}
              onKeyDown={(event) => {
                // Call keyPressed function with email
                keyPressed(event, "email");
              }}
            ></input>{" "}
          </div>
          {/* Display password input if user has enetered email */}
          {displayPass && (
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Please enter your password..."
              className="password-input"
              onChange={(event) => {
                event.preventDefault();
                setPassword(event.target.value);
              }}
              onKeyDown={(event) => {
                // call keyPressed function with password
                keyPressed(event, "password");
              }}
            />
          )}
          <button className="continue-btn" onClick={signInExistingUser}>
            Continue
          </button>{" "}
          {/* trigger sign-in with email and password */}
          <p className="sign-up">
            Don't have an account?{" "}
            <a
              className="sign-up-txt"
              onClick={() => {
                // Navigate to the signup page
                navigate("/signup");
              }}
            >
              Sign Up
            </a>
          </p>
          <div className="or-line">
            <div className="line"></div>
            <div className="or-box">OR</div>
            <div className="line"></div>
          </div>
          <div className="social-login-boxes">
            <a
              className="social-login-box google-box"
              onClick={signInWithGoogle}
            >
              <img
                src="./google_logo.png"
                alt="Google Logo"
                className="login-logo"
              />
              Continue with Google
            </a>
            <a className="social-login-box microsoft-box">
              <img
                src="./Microsoft_icon.svg.png"
                alt="Microsoft Logo"
                className="login-logo"
              />
              Continue with Microsoft
            </a>
            <a className="social-login-box facebook-box">
              <img
                src="./facebook_logo.webp"
                alt="Facebook Logo"
                className="login-logo"
              />
              Continue with Facebook
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LogInPage;
