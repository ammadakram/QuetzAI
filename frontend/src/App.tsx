import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LogInPage from './Components/LogInPage';
import './App.css';
import LogInPassword from './Components/LogInPassword';
import LandingPage from './Components/LandingPage1';
import HomePage from './Components/HomePage';
import ForgotPassword from './Components/ForgotPassword';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Need to route this differently later. We will be checking if user exists when they log on. */}
          {/* <Route path="/" element={<LandingPage />} /> */}

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LogInPage />} />
          <Route path="/auth" element={<LogInPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
