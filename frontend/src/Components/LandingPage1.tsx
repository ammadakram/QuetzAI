import React from "react";
import "./LandingPage1.css";
import TypingAnimation from "./TypingAnimation"; // Import the TypingAnimation component
import { useNavigate } from "react-router";

function LandingPage() {
  let navigate = useNavigate();
  const texts = ["Welcome to QuetzAI", "Discover the power of AI", "Sign up now!"]; // Array of texts for typing animation
  return (
    <div className="app">
      <div className="left-div">
        <div className="header">
          <img src="QuetzAI_logo.png" alt="QuetzAI Logo" className="logo" />
          <h1 className="logo_text">QuetzAI</h1>
        </div>
        <TypingAnimation texts={texts} /> {/* Include the TypingAnimation component with texts prop */}
      </div>
      <div className="right-div">
        <div className="buttons">
          <h2 className="get-started-txt">Get Started</h2>
          <div className="login-div">
            <button
              className="login-btn"
              onClick={() => {
                navigate("/login");
              }}
              >
              Login
            </button>
            <button
              className="signup-btn"
              onClick={() => {
                navigate("/signup");
              }}
              >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
