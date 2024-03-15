import "./SignupPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // State for various reasons.
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayPass, setDisplayPass] = useState(false);
  const [displayConfirmPass, setDisplayConfirm] = useState(false);
  // async function for signing up with email and password.
  const signUpWithEmailAndPassword = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };
  // async function for signing up with Google.
  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };
  // key pressed function that discriminates between sources to display various components.
  const keyPressed = (
    event: React.KeyboardEvent<HTMLInputElement>,
    from: string
  ) => {
    if (event.key === "Enter" && from === "email") {
      setDisplayPass(true);
    }
    if (event.key === "Enter" && from === "password_first") {
      setDisplayConfirm(true);
    }
    if (event.key === "Enter" && from === "password") {
      if (confirmPassword !== password) {
        console.log("Passwords don't match!");
        return;
      }
      signUpWithEmailAndPassword();
    }
  };

  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="signup-container">
        <div className="create-account-text">Create your account</div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Please enter your email address..."
          className="email-input"
          onChange={(event) => {
            event.preventDefault();
            setEmail(event.target.value);
          }}
          onKeyDown={(event) => {
            keyPressed(event, "email");
          }}
        />
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
              keyPressed(event, "password_first");
            }}
          />
        )}
        {displayConfirmPass && (
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Please confirm your password..."
            className="password-input"
            onChange={(event) => {
              event.preventDefault();
              setConfirmPassword(event.target.value);
            }}
            onKeyDown={(event) => {
              keyPressed(event, "password");
            }}
          />
        )}
        <div className="next-box">
          <button className="next-btn" onClick={signUpWithEmailAndPassword}>
            Next
          </button>
        </div>
      </div>
      <div className="login-text">
        Already have an account?{" "}
        <a
          className="log-in-txt"
          onClick={() => {
            navigate("/login");
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
      <div className="social-login-boxes">
        <a
          href="#"
          className="social-login-box google-box"
          onClick={signUpWithGoogle}
        >
          <img
            src="./google_logo.png"
            alt="Google Logo"
            className="login-logo"
          />
          Sign up with Google
        </a>
        <a href="#" className="social-login-box microsoft-box">
          <img
            src="./Microsoft_icon.svg.png"
            alt="Microsoft Logo"
            className="login-logo"
          />
          Sign up with Microsoft
        </a>
        <a href="#" className="social-login-box facebook-box">
          <img
            src="./facebook_logo.webp"
            alt="Facebook Logo"
            className="login-logo"
          />
          Sign up with Facebook
        </a>
      </div>
    </div>
  );
}

export default SignupPage;
