import "./SignupPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const maybeEmail = location.state?.email;
  console.log("My maybe email is: ", maybeEmail);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayPass, setDisplayPass] = useState(false);
  const signUpWithEmailAndPassword = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };
  const keyPressed = (
    event: React.KeyboardEvent<HTMLInputElement>,
    from: string
  ) => {
    if (event.key === "Enter" && from === "email") {
      console.log("Set display pass to true!");
      setDisplayPass(true);
      console.log(displayPass);
    }
    if (event.key === "Enter" && from === "password") {
      console.log(`Should create a user with ${email} and ${password}`);
      signUpWithEmailAndPassword();
    }
  };

  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="create-account-text">create account</div>
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
          placeholder="password"
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
      <div className="next-box">
        <button className="next-btn" onClick={signUpWithEmailAndPassword}>
          Next
        </button>
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
        <a href="#" className="social-login-box google-box">
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
