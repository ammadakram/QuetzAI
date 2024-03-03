import './SignupPage.css';

function SignupPage() {
  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="create-account-text">create account</div>

      <input type="email" id="email" name="email" placeholder="email address" className="email-input" />
      <div className="next-box">
        next
      </div>
      <div className="login-text">
        Already have an account? <a href="#">Log in</a>
      </div>
      <div className="or-line">
        <div className="line"></div>
        <div className="or-box">Or</div>
        <div className="line"></div>
      </div>
      <div className="social-login-boxes">
        <a href="#" className="social-login-box google-box">
          <img src="./google_logo.png" alt="Google Logo" className="login-logo" />
          Log in with Google
        </a>
        <a href="#" className="social-login-box microsoft-box">
          <img src="./Microsoft_icon.svg.png" alt="Microsoft Logo" className="login-logo" />
          Log in with Microsoft
        </a>
        <a href="#" className="social-login-box facebook-box">
          <img src="./facebook_logo.webp" alt="Facebook Logo" className="login-logo" />
          Log in with Facebook
        </a>
        </div>
    </div>
  );
}

export default SignupPage;
