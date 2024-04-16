import './LogInPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';

function LogInPage() {
  const navigate = useNavigate();
  // Creating a GoogleAuthProvider instance from firebase
  const provider = new GoogleAuthProvider();
  // State for entered email
  const [enteredEmail, setEnteredEmail] = useState('');
  // State for password
  const [password, setPassword] = useState('');
  // State to control display of password input
  const [displayPass, setDisplayPass] = useState(false);

  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passEmpty, setPassEmpty] = useState(false);
  const [passNotMatch, setPassNotMatch] = useState(false);

  // sign in existing user with email and password
  const signInExistingUser = async () => {
    if (!displayPass) {
      setDisplayPass(true);
      return;
    }
    try {
      // Signing in with email and password
      await signInWithEmailAndPassword(auth, enteredEmail, password);
      navigate('/home');
    } catch (err) {
      // Logging any errors that occur during sign-in
      console.error(err);
      setPassNotMatch(true);
    }
  };

  // sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Signing in with Google using popup
      await signInWithPopup(auth, provider);
      setPassNotMatch(false);
      navigate('/home');
    } catch (err) {
      // Logging any errors that occur during sign-in with Google
      console.error(err);
    }
  };

  // check what inputs have been rendered when next button is pressed
  const contPressed = () => {
    if (!displayPass) {
      checkInputs('email');
    } else {
      checkInputs('password');
      // signInExistingUser();
    }
  };

  const handleRendering = () => {
    if (!displayPass) {
      setDisplayPass(true);
      return false;
    }
    return true;
  };

  //Deals with empty inputs and rendering next input filed
  const checkInputs = (from: string) => {
    if (from === 'email') {
      if (enteredEmail === '') {
        setEmailEmpty(true);
        if (passNotMatch) {
          setPassNotMatch(false);
        }
      } else {
        setEmailEmpty(false);
        handleRendering();
      }
    }
    if (from === 'password') {
      if (password === '') {
        setPassEmpty(true);
        if (passNotMatch) {
          setPassNotMatch(false);
        }
      } else {
        setPassEmpty(false);
        signInExistingUser();
      }
    }
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="login-container">
        <div className="welcome-back-text">Welcome back</div>

        {emailEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter an email address</span>
          </div>
        )}

        {displayPass && !emailEmpty && !passEmpty && passNotMatch && (
          <div className="popup">
            <span className="popup-text">Invalid email or password</span>
          </div>
        )}

        <input
          className={`email-input ${
            emailEmpty || passNotMatch ? 'email-input-empty' : ''
          }`}
          type="email"
          name="email"
          placeholder="email address"
          onChange={(event) => {
            event.preventDefault();
            setEnteredEmail(event.target.value);
          }}
          onKeyDown={(event) => {
            // Call keyPressed function with email
            if (event.key === 'Enter') {
              checkInputs('email');
            }
          }}
        ></input>

        {displayPass && passEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter a password</span>
          </div>
        )}

        {displayPass && !passEmpty && passNotMatch && (
          <div className="popup">
            <span className="popup-text">Invalid email or password</span>
          </div>
        )}

        {/* Display password input if user has enetered email */}
        {displayPass && (
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter password"
            className={`password-input ${
              passEmpty || passNotMatch ? 'password-input-empty' : ''
            }`}
            onChange={(event) => {
              event.preventDefault();
              setPassword(event.target.value);
            }}
            onKeyDown={(event) => {
              // call keyPressed function with password
              if (event.key === 'Enter') {
                checkInputs('password');
              }
            }}
          />
        )}

        {/* trigger sign-in with email and password */}
        <div className="continue-box">
          <button className="continue-btn" onClick={contPressed}>
            Continue
          </button>
        </div>
      </div>

      <div className="signup-text">
        Don't have an account?{' '}
        <a
          className="sign-up-txt"
          // Navigate to the signup page
          onClick={() => {
            navigate('/signup');
          }}
        >
          Sign Up
        </a>
      </div>

      <div className="or-line">
        <div className="line"></div>
        <div className="or-box">Or</div>
        <div className="line"></div>
      </div>

      <a href="#" className="social-login-box" onClick={signInWithGoogle}>
        <img src="./google_logo.png" alt="Google Logo" className="login-logo" />
        Continue with Google
      </a>
    </div>
  );
}

export default LogInPage;
