import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom'; // Router hooks import kiye
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
function App() {
  return (
    <Router>  
      <Routes>   
        <Route path="/" element={<Navigate to="/login" replace />} />  
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path ="/workspace/:id" element={<Workspace/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;