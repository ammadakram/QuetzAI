import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LogInPage from "./Components/LogInPage";
import LogInPassword from "./Components/LogInPassword";
import LandingPage from "./Components/LandingPage1";
import SignupPage from "./Components/SignupPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />{" "}
          {/* Need to route this differently later. We will be checking if user exists when they log on. */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/auth" element={<LogInPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
