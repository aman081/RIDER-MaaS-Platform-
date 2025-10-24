import React, { useRef, useState, useEffect, useContext } from 'react'; // Consolidated imports
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import LiveTracking from '../components/LiveTracking';
import axios from 'axios';

const CaptainHome = () => {
    const [userPickupCoords, setUserPickupCoords] = useState(null);
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const [ride, setRide] = useState(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext); // Use useContext directly

    // --- Effect for Joining Socket Room AND Getting Initial Location ---
    useEffect(() => {
        // Ensure captain data and socket are ready
        if (captain && captain._id && socket) {
            console.log(`Captain ${captain._id} joining socket room.`);
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });

            // --- Get Location ONCE ---
            if (navigator.geolocation) {
                console.log("Attempting to get initial captain location...");
                navigator.geolocation.getCurrentPosition(
                    // Success Callback
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        console.log(`Initial Captain Location - Lat: ${lat}, Lng: ${lng}`);

                        // Emit the location to the backend
                        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                            socket.emit('update-location-captain', {
                                userId: captain._id,
                                location: {
                                    type: "Point",
                                    coordinates: [lng, lat]
                                }
                            });
                        } else {
                            console.warn("Invalid lat/lng from geolocation API.");
                        }


                        console.log("Initial location sent to backend.");
                    },
                    // Error Callback
                    (error) => {
                        console.error("Error getting initial captain location:", error);
                        // You might want to inform the user or try a fallback
                    },
                    // Options
                    {
                        enableHighAccuracy: true,
                        timeout: 20000, // Give it 20 seconds for the first try
                        maximumAge: 0   // Force a fresh location
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
            // --- End Get Location ONCE ---

        } else {
            console.warn("Captain data or socket not ready for join/location.");
        }

        // No cleanup needed for getCurrentPosition (it runs once)
        // Add dependencies
    }, [captain, socket]); // Runs when captain or socket changes (effectively once on login)


    useEffect(() => {
        if (!socket) return;

        // Handle new ride requests & get pickup coords
        const handleNewRide = async (rideData) => {
            console.log("Received new ride data:", rideData);
            setRide(rideData);
            setRidePopupPanel(true); // Show the initial popup
            setUserPickupCoords(null); // Clear previous coords

            // Fetch pickup coordinates for the map marker
            if (rideData.pickup) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                        params: { address: rideData.pickup },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Pickup coordinates fetched:", response.data);
                    setUserPickupCoords({ lat: response.data.ltd, lng: response.data.lng });
                } catch (err) {
                    console.error("Error getting pickup coords for captain map:", err.response?.data || err.message);
                }
            }
        };

        socket.on('new-ride', handleNewRide);

        // No need to listen for 'user-location-update' anymore

        return () => {
            socket.off('new-ride', handleNewRide);
        };
    }, [socket]);

    async function confirmRide() {
        // ... (confirmRide function remains the same) ...
        try {
            console.log(ride)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/confirm`, {
                rideId: ride._id,
                // captainId: captain._id, // Backend gets captain from auth middleware
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log("Ride confirmed response:", response.data);
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error("Error confirming ride:", error.response?.data || error.message);
        }
    }

    // --- GSAP Animations (remain the same) ---
    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        });
    }, [ridePopupPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        });
    }, [confirmRidePopupPanel]);


    // --- JSX (remains the same) ---
    return (
        <div className='h-screen relative overflow-hidden'> {/* Added overflow-hidden */}
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-20'> {/* Added z-index */}
                <img className='w-16' src="https://imgs.search.brave.com/yjzGFf2Us28osYOCiZ6SYSGUGswyR6tspkw91KDlljw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjIvQ2Fy/LUxvZ28tUE5HLVBp/Yy5wbmc" alt="Logo" />
                <Link to='/CaptainLogin' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'> {/* Added shadow */}
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* Map Area */}
            <div className='h-3/5 w-full'> {/* Ensure map takes full width */}
                <LiveTracking
                    ownRole="captain"
                    // Pass user pickup coords ONLY when a ride popup is active
                    otherPartyLocation={(ridePopupPanel || confirmRidePopupPanel) ? userPickupCoords : null}
                />
            </div>

            {/* Captain Details Area */}
            <div className='h-2/5 p-6 bg-white'> {/* Added bg-white */}
                <CaptainDetails />
            </div>

            {/* Ride Popup Panel */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-lg'> {/* Added shadow & z-index */}
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirmed Ride Popup Panel */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-40 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-lg'> {/* Added shadow & higher z-index */}
                <ConfirmRidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                />
            </div>
        </div>
    );
}

export default CaptainHome;