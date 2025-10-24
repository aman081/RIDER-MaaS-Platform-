import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'


const CaptainLogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const {captain, setCaptain } = useContext(CaptainDataContext);
  const navigate=useNavigate();



  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response=await axios.post(`https://${import.meta.env.VITE_API_URL}/captain/login`,captain);
    if(response.status===200){
      const data=response.data;
      setCaptain(data.captain);
      localStorage.setItem('token',data.token);
      navigate('/CaptainHome');
    }

    setEmail('')
    setPassword('')
  
    }


  
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://imgs.search.brave.com/yjzGFf2Us28osYOCiZ6SYSGUGswyR6tspkw91KDlljw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjIvQ2Fy/LUxvZ28tUE5HLVBp/Yy5wbmc" alt="" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>

        </form>
        <p className='text-center'>Join a fleet? <Link to='/CaptainSignup' className='text-blue-600'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link
          to='/UserLogin'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin