import React,{useState,useContext} from 'react'
import { Navigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const UserProtectWrapper = ({children}) => {
    const token=localStorage.getItem('token');
    // const navigate=useNavigate();
    const {user,setUser}= useContext(UserDataContext);

    if(!token || !user) return <Navigate to='/UserLogin' replace/>;

  return children
  
}

export default UserProtectWrapper
