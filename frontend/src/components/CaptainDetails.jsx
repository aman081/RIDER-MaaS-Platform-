
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {

    const { captain } = React.useContext(CaptainDataContext)

    return (
        <div >
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://imgs.search.brave.com/2ZYO9Sc5HyEG6kJ_UwAulu-hemHrvB7RTsYZcOFt7zc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GaWxl/LURvd25sb2FkLUZy/ZWUucG5n" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹1,396</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>31</h5>
                    <p className='text-sm text-gray-600'>Total Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 ri-car-fill"></i>
                    <h5 className='text-lg font-medium'>{captain.vehicle.Vehicletype}</h5>
                    <p className='text-sm text-gray-600'>Vehicle</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{captain.vehicle.plate}</h5>
                    <p className='text-sm text-gray-600'>Plate Number</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails