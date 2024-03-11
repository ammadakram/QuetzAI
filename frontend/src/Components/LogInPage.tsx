import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogInPage.css";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";

function LogInPage() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayPass, setDisplayPass] = useState(false);
  const signInExistingUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, enteredEmail, password);
    } catch (err) {
      // Add error handling here.
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      // Add error handling here.
      console.error(err);
    }
  };

  const keyPressed = (
    event: React.KeyboardEvent<HTMLInputElement>,
    source: string
  ) => {
    if (event.key === "Enter" && source === "password") {
      signInExistingUser();
    } else if (event.key === "Enter" && source === "email") {
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
                keyPressed(event, "email");
              }}
            ></input>
          </div>

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
                keyPressed(event, "password");
              }}
            />
          )}

          <button className="continue-btn" onClick={signInExistingUser}>
            Continue
          </button>

          <p className="sign-up">
            <span>Don't have an account? </span>
          </p>
          <a
            className="sign-up-txt"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </a>

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
