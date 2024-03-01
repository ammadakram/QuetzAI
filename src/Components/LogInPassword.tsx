import { useLocation } from 'react-router-dom';
import './LogInPage.css';
import './LogInPassword.css';

function LogInPassword() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="LogInPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>

      <div className="login-container">
        <section className="container-wrapper">
          {/* <div className="welcome-box-text">Welcome back</div> */}

          <div className="welcome-box">
            <h1 className="welcome-text">Enter your password</h1>
          </div>

          <div className="email-wrapper">
            <input
              className="email-input"
              type="email"
              name="email"
              value={email}
              placeholder="email address"
            ></input>
          </div>

          <div className="password-wrapper">
            <input
              className="password-input"
              type="password"
              name="password"
              placeholder="password"
            ></input>
          </div>

          <a className="forgot-password" href="">
            Forgot Password?
          </a>

          <button className="continue-btn">Continue</button>

          <p className="sign-up">
            Don't have an account?{' '}
            <a className="sign-up-text" href="">
              Sign Up
            </a>
          </p>

          <div className="or-line">
            <div className="line"></div>
            <div className="or-box">OR</div>
            <div className="line"></div>
          </div>

          <div className="social-login-boxes">
            <a href="#" className="social-login-box google-box">
              <img
                src="./google_logo.png"
                alt="Google Logo"
                className="login-logo"
              />
              Continue with Google
            </a>
            {/* <a href="#" className="social-login-box microsoft-box">
              <img
                src="./Microsoft_icon.svg.png"
                alt="Microsoft Logo"
                className="login-logo"
              />
              Continue with Microsoft
            </a>
            <a href="#" className="social-login-box facebook-box">
              <img
                src="./facebook_logo.webp"
                alt="Facebook Logo"
                className="login-logo"
              />
              Continue with Facebook
            </a> */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LogInPassword;
