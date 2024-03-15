import { useLocation, useNavigate } from 'react-router-dom';
import './LogInPage.css';
import './ForgotPassword.css';

function ForgotPassword() {
  const location = useLocation();
  // Extracting email from location state
  const userEmail = location.state?.email;
  const navigate = useNavigate();

  // Function to handle sending reset password email
  const sendResetPasswordEmail = () => {};

  // Function to navigate back to the login page
  const goBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src="./QuetzAI_logo_Inverted.png" alt="Logo" />
      </div>
      <div className="login-container">
        <section className="container-wrapper">
          <div className="title-box">
            <h1 className="title-text">Reset your password</h1>{' '}
          </div>
          <div className="reset-instructions">
            <p>
              Enter your email address and we will send you instructions to
              reset your password.
            </p>{' '}
          </div>
          <div className="email-wrapper">
            <input
              className="email-input"
              type="email"
              name="email"
              value={userEmail}
              placeholder="email address"
            ></input>
          </div>
          <button className="continue-btn" onClick={sendResetPasswordEmail}>
            Continue
          </button>
          <a className="go-back-login" onClick={goBackToLogin}>
            Go back to login
          </a>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;
