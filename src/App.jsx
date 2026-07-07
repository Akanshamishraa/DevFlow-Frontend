import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Router hooks import kiye
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    // 1. Router container wrapper
    <Router>
      {/* 2. Routes block */}
      <Routes>
        
        {/* 3. Path mapping */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;