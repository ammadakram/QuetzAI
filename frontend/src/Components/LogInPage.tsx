import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogInPage.css';

function LogInPage() {
  const navigate = useNavigate();

  const [enteredEmail, setEnteredEmail] = useState('');

  const keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      goToLoginPassword();
    }
  };

  const goToLoginPassword = () => {
    navigate('/auth', { state: { email: enteredEmail } });
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
              onKeyDown={keyPressed}
            ></input>
          </div>

          <button className="continue-btn" onClick={goToLoginPassword}>
            Continue
          </button>

          <p className="sign-up">
            <span>Don't have an account? </span>
          </p>
          <a
            className="sign-up-txt"
            onClick={() => {
              navigate('/signup');
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
            <a className="social-login-box google-box">
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
