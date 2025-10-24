import react from 'react';
import { Route,Routes } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/UserLogin';
import CaptainLogin from './pages/CaptainLogin';
import UserSignup from './pages/UserSignup';
import CaptainSignup from './pages/CaptainSignup';
import Home from './pages/Home';
import UserProtectWrapper from './pages/UserProtectWrapper';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import UserLogout from './pages/UserLogout';
import CaptainLogout from './pages/CaptainLogout';
import CaptainHome from './pages/CaptainHome';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import ConfirmRidePopUp from './components/ConfirmRidePopUp';
import WaitingForDriver from './components/WaitingForDriver';
import 'remixicon/fonts/remixicon.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/waiting' element={<WaitingForDriver/>} />
        <Route path='/popup' element={<ConfirmRidePopUp/>} />
        <Route path='/' element={<Start/>} />
        <Route path='/Captain-home' element={<CaptainHome/>} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path="/UserLogin" element={<UserLogin/>} />
        <Route path="/CaptainLogin" element={<CaptainLogin/>} />
        <Route path="/UserSignup" element={<UserSignup/>} />
        <Route path="/CaptainSignup" element={<CaptainSignup/>} />
        <Route path="/home" element={
          <UserProtectWrapper>
            <Home/>
          </UserProtectWrapper>
          } />
        <Route path="/User/Logout" element={
          <UserProtectWrapper>
            <UserLogout/>
          </UserProtectWrapper>
          } />
           <Route path="/Captain/Logout" element={
          <CaptainProtectWrapper>
            <CaptainLogout/>
          </CaptainProtectWrapper>
          } />
          <Route path="/CaptainHome" element={
            <CaptainProtectWrapper>
            <CaptainHome/>
            </CaptainProtectWrapper>}/>
      </Routes>
    </div>
  );
}

export default App;