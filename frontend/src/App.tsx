import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import HomePage from './pages/HomePage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
  <Route path="/home" element={<HomePage/>} />
    </Routes>
  </Router>
);

export default App;

