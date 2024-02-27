import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignupPage from './Components/SignupPage';
import SignupPagePassword from './Components/SingupPagePassword';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPagePassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
