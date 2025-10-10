import react from 'react';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import CaptainLogin from './pages/CaptainLogin';
import UserSignup from './pages/UserSignup';
import CaptainSignup from './pages/CaptainSignup';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/UserLogin" element={<UserLogin/>} />
        <Route path="/CaptainLogin" element={<CaptainLogin/>} />
        <Route path="/UserSignup" element={<UserSignup/>} />
        <Route path="/CaptainSignup" element={<CaptainSignup/>} />
        
      </Routes>
    </div>
  );
}

export default App;