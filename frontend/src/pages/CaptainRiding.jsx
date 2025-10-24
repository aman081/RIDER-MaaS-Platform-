import React, { useRef, useState, useEffect, useContext } from 'react'; // Added useEffect, useState, useContext
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LiveTracking from '../components/LiveTracking';
import axios from 'axios'; // Import axios
// Import SocketContext if needed for other events, otherwise remove
// import { SocketContext } from '../context/SocketContext';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);
    const location = useLocation();
    const rideData = location.state?.ride;

    // --- ADD State for user pickup coordinates ---
    const [userPickupCoords, setUserPickupCoords] = useState(null);
    // const { socket } = useContext(SocketContext); // Get socket if needed

    // --- ADD Effect to fetch pickup coordinates ---
    useEffect(() => {
        const fetchPickupCoords = async () => {
            // Ensure rideData and pickup address exist
            if (rideData?.pickup) {
                console.log("CaptainRiding: Fetching coordinates for pickup:", rideData.pickup);
                try {
                    const token = localStorage.getItem('token');
                    // Fetch coordinates using the pickup address string
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: rideData.pickup },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Validate response and set state
                    if (typeof response.data.ltd === 'number' && typeof response.data.lng === 'number') {
                        setUserPickupCoords({ lat: response.data.ltd, lng: response.data.lng });
                        console.log("Captain Riding - Pickup Coords Set:", response.data);
                    } else {
                        throw new Error("Invalid coordinate data received from API");
                    }
                } catch (err) {
                    console.error("Error getting pickup coords for CaptainRiding map:", err.response?.data || err.message);
                    setUserPickupCoords(null); // Set to null on error
                }
            } else {
                console.warn("CaptainRiding: No pickup address found in rideData.");
                setUserPickupCoords(null); // Ensure state is null if no address
            }
        };

        fetchPickupCoords();
        // Add cleanup for socket listeners here if you add any for this component
    }, [rideData]); // Dependency array: Re-run if rideData changes


    // --- Keep your existing useGSAP hook ---
    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)'
        });
    }, [finishRidePanel]);

    // --- Keep your check for rideData ---
    if (!rideData) {
        return <div>Error: Ride data not found.</div>;
    }

    // --- Keep your original JSX structure ---
    return (
        <div className='h-screen relative flex flex-col justify-end'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                {/* ... Header content ... */}
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/CaptainLogin' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* Bottom Panel */}
            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                {/* ... Bottom panel content ... */}
                <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{'Ride Ongoing'}</h4> {/* Changed text */}
                <button className=' bg-red-600 text-white font-semibold p-3 px-10 rounded-lg'>End Ride</button> {/* Changed text */}
            </div>

            {/* Finish Ride Panel */}
            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            {/* --- Modify LiveTracking props ONLY --- */}
            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                <LiveTracking
                    ownRole="captain"
                    otherPartyLocation={userPickupCoords} // Pass the fetched coords
                />
            </div>
            {/* --- End modification --- */}

        </div>
    );
};

export default CaptainRiding;