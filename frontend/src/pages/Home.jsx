import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='h-screen bg-cover bg-bottom bg-[url(https://plus.unsplash.com/premium_photo-1682834983265-27a10ba5232c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000)] flex justify-between flex-col  w-full bg-red-400'>
       <img className='w-16 ml-8' src="data:image/png;base64,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"/>
        <div className='bg-white flex-col py-4 px-4 pb-7'>
            <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
            <Link to='/UserLogin' className='flex items-center justify-center w-full h-7 bg-black rounded text-white mt-4'>Continue</Link>
        </div>

      </div>
    </div>
  )
}

export default Home
