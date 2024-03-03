import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LogInPage from './Components/LogInPage';
import LogInPassword from './Components/LogInPassword';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/auth" element={<LogInPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
