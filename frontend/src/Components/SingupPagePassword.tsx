import './SignupPagePassword.css';

function SignupPagePassword() {
  return (
    <div className="SignupPagePassword">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="create-account-text">create your account</div>

      <input type="email" id="email" name="email" placeholder="email address" className="email-input" />

      <input type="password" id="password" name="password" placeholder="password" className="password-input" />

      <div className="next-box">
        Continue
      </div>
      <div className="login-text">
        Already have an account? <a href="#">Log in</a>
      </div>
    </div>
  );
}

export default SignupPagePassword;

