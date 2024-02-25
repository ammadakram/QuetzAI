import './SignupPage.css';

function SignupPage() {
  return (
    <div className="SignupPage">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="create-account-text">Create Account</div>
      <div className="email-box">
        <input type="email" id="email" name="email" placeholder="Email Address" />
      </div>
      <div className="next-box">
        Next
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
        <a href="#" className="social-login-box google-box">Continue with Google</a>
        <a href="#" className="social-login-box microsoft-box">Continue with Microsoft</a>
        <a href="#" className="social-login-box facebook-box">Continue with Facebook</a>
      </div>
    </div>
  );
}

export default SignupPage;
