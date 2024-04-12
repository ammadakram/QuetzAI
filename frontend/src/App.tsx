import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LogInPage from "./Components/LogInPage";
import LandingPage from "./Components/LandingPage1";
import HomePage from "./Components/HomePage";
import ForgotPassword from "./Components/ForgotPassword";
import SignupPage from "./Components/SignupPage";
import PrivateRoutes from "./Components/PrivateRoutes";
import ChatPage from "./Components/ChatPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} />{" "} */}
          {/* Need to route this differently later. We will be checking if user exists when they log on. */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
