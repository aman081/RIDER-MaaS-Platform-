import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='h-screen bg-cover bg-bottom bg-[url(https://images.unsplash.com/photo-1572013343866-dfdb9b416810?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGF4aXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600)] flex justify-between flex-col  w-full bg-red-400'>
       <img className='w-16 ml-8' src="https://imgs.search.brave.com/yjzGFf2Us28osYOCiZ6SYSGUGswyR6tspkw91KDlljw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjIvQ2Fy/LUxvZ28tUE5HLVBp/Yy5wbmc"/>
        <div className='bg-white flex-col py-4 px-4 pb-7'>
            <h2 className='text-3xl font-bold'>Get Started with SAARTHI</h2>
            <Link to='/UserLogin' className='flex items-center justify-center w-full h-9 bg-black rounded text-white mt-4'>Continue</Link>
        </div>

      </div>
    </div>
  )
}

export default Start
