import React,{useState,useContext} from 'react'
import { Navigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectWrapper = ({children}) => {
    const token=localStorage.getItem('token');
    // const navigate=useNavigate();
    const {captain,setcaptain}= useContext(CaptainDataContext);

    if(!token || !captain) return <Navigate to='/CaptainLogin' replace/>;

  return children
  
}

export default CaptainProtectWrapper