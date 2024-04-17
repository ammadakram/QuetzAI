import React from 'react';
import './LandingPage1.css';
import TypingAnimation from './TypingAnimation';
import { useNavigate } from 'react-router';

function LandingPage() {
  let navigate = useNavigate();

  // Array of texts for typing animation
  const texts = [
    'What was Plato’s idea of a republic?',
    'What are the key principles of agile software development?',
    'Can you explain the concept of risk management in investing?',
    'Can you explain the concept of judicial precedent?',
  ];

  return (
    <div className="app">
      <div className="left-div">
        <div className="header">
          <img
            src="QuetzAI_logo.png"
            alt="QuetzAI Logo"
            className="logo-landing"
          />
          <h1 className="logo-text">QuetzAI</h1>
        </div>
        <TypingAnimation texts={texts} />
      </div>
      <div className="right-div">
        <div className="buttons">
          <h2 className="get-started-txt">Get Started</h2>
          <div className="login-div">
            <button
              className="login-btn"
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </button>
            <button
              className="signup-btn"
              onClick={() => {
                navigate('/signup');
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
