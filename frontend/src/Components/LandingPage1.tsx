import "./LandingPage1.css";
import { useNavigate } from "react-router";

function LandingPage() {
  let navigate = useNavigate();
  return (
    <div className="app">
      <div className="left-div">
        {/* <div className="header">
          <img src="QuetzAI_logo.png" alt="QuetzAI Logo" className="logo" />
          <h1>QuetzAI</h1>
        </div> */}
        <div className="animation-div">
          <p>animation goes here</p>
        </div>
      </div>
      <div className="right-div">
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
  );
}
export default LandingPage;
