import './SignupPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { all } from 'axios';

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // State for various reasons.
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayPass, setDisplayPass] = useState(false);
  const [displayConfirmPass, setDisplayConfirm] = useState(false);

  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passEmpty, setPassEmpty] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [passNotMatch, setPassNotMatch] = useState(false);

  const createUserRecord = async () => {
    await setDoc(doc(db, 'user_info', `${auth.currentUser?.uid}`), {
      username: auth.currentUser?.email,
      chats: [],
      files: [],
      chat_and_file: [],
    });
  };

  const handleRendering = () => {
    if (!displayPass) {
      setDisplayPass(true);
      return false;
    }
    if (!displayConfirmPass) {
      setDisplayConfirm(true);
      return false;
    }
    if (confirmPassword !== password) {
      console.error("Passwords don't match!");
      setPassNotMatch(!passNotMatch);
      return false;
    } else {
      setPassNotMatch(false);
    }
    return true;
  };

  // check what inputs have been rendered when next button is pressed
  const nextPressed = () => {
    if (!displayPass) {
      checkInputs('email');
    } else if (!displayConfirmPass) {
      checkInputs('password');
    } else {
      checkInputs('confirm_password');
      signUpWithEmailAndPassword();
    }
  };

  // async function for signing up with email and password.
  const signUpWithEmailAndPassword = async () => {
    // check if fields have been filled
    if (!handleRendering()) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await createUserRecord();
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  // async function for signing up with Google.
  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      await createUserRecord();
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  //Deals with empty inputs and rendering next input filed
  const checkInputs = (from: string) => {
    if (from === 'email') {
      if (email === '') {
        setEmailEmpty(true);
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
        handleRendering();
      }
    }
    if (from === 'confirm_password') {
      if (confirmPassword === '') {
        setConfirmEmpty(true);
        if (passNotMatch) {
          setPassNotMatch(false);
        }
      } else {
        setConfirmEmpty(false);
        signUpWithEmailAndPassword();
      }
    }
  };

  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="signup-container">
        <div className="create-account-text">Create your account</div>

        {emailEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter an email address</span>
          </div>
        )}

        <input
          type="email"
          id="email"
          name="email"
          placeholder="email address"
          // className="email-input"
          className={`email-input ${emailEmpty ? 'email-input-empty' : ''}`}
          onChange={(event) => {
            event.preventDefault();
            setEmail(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              checkInputs('email');
            }
          }}
        />

        {displayPass && passEmpty && (
          <div className="popup">
            <span className="popup-text">Please enter a password</span>
          </div>
        )}

        {displayPass && displayConfirmPass && passNotMatch && (
          <div className="popup">
            <span className="popup-text">Passwords do not match!</span>
          </div>
        )}

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
              if (event.key === 'Enter') {
                checkInputs('password');
              }
            }}
          />
        )}

        {displayConfirmPass && confirmEmpty && (
          <div className="popup">
            <span className="popup-text">Please confirm your password</span>
          </div>
        )}

        {displayPass && displayConfirmPass && passNotMatch && (
          <div className="popup">
            <span className="popup-text">Passwords do not match!</span>
          </div>
        )}

        {displayConfirmPass && (
          <input
            type="password"
            id="password"
            name="password"
            placeholder="confirm password"
            className={`password-input ${
              confirmEmpty || passNotMatch ? 'password-input-empty' : ''
            }`}
            onChange={(event) => {
              event.preventDefault();
              setConfirmPassword(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                checkInputs('confirm_password');
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

      <div className="login-text">
        Already have an account?{' '}
        <a
          className="log-in-txt"
          onClick={() => {
            navigate('/login');
          }}
        >
          Log In
        </a>
      </div>

      <div className="or-line">
        <div className="line"></div>
        <div className="or-box">Or</div>
        <div className="line"></div>
      </div>

      <a href="#" className="social-login-box" onClick={signUpWithGoogle}>
        <img src="./google_logo.png" alt="Google Logo" className="login-logo" />
        Sign up with Google
      </a>
    </div>
  );
}

export default SignupPage;
