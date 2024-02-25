import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignupPage from './Components/SignupPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
