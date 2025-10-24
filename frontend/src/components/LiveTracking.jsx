import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

// Default center (e.g., somewhere in India)
const initialCenter = {
    lat: 22.7758,
    lng: 86.1445
};

// Accept props: ownRole ('user' or 'captain'), otherPartyLocation ({ lat: number, lng: number })
const LiveTracking = ({ ownRole, otherPartyLocation }) => {
    const [myPosition, setMyPosition] = useState(null); // Your own position
    const [mapCenter, setMapCenter] = useState(initialCenter); // Separate state for map center
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false); // Track if API loaded

    // --- Define icons INSIDE the component ---
    // Use state for icons so they are only created once the API is loaded
    const [userIconObj, setUserIconObj] = useState(null);
    const [driverIconObj, setDriverIconObj] = useState(null);

    // Effect to create icons once google.maps is available
    useEffect(() => {
        if (googleMapsLoaded && window.google && window.google.maps) {
            setUserIconObj({
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Standard blue dot
                scaledSize: new window.google.maps.Size(40, 40)
            });
            setDriverIconObj({
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Standard red dot
                 // You can replace the URL above with a car icon URL if you have one
                scaledSize: new window.google.maps.Size(40, 40)
            });
        }
    }, [googleMapsLoaded]); // Dependency on API load status


    // --- Effect for getting YOUR location ---
    useEffect(() => {
        let watchId = null;
        if (navigator.geolocation) {
            // Get initial position once to center the map quickly
             navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const initialPos = { lat: latitude, lng: longitude };
                    console.log("Initial position:", initialPos);
                    setMyPosition(initialPos);
                    setMapCenter(initialPos); // Center map on first fix
                },
                (error) => {
                    console.error("Error getting initial position:", error);
                    // Handle error, maybe keep default center
                    if (!myPosition) { // Only set default if we never got a position
                         setMyPosition(initialCenter); // Fallback to default
                         setMapCenter(initialCenter);
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 } // Allow slightly older cache
            );

            // Start watching for continuous updates
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    setMyPosition(newPos);
                    // Don't recenter map automatically, let user pan
                },
                (error) => {
                    console.error("Error watching position:", error);
                },
                // More relaxed options for watchPosition
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
            );

        } else {
             console.error("Geolocation is not supported by this browser.");
             // Set default position if geolocation not supported
             setMyPosition(initialCenter); // Fallback to default
             setMapCenter(initialCenter);
        }

        // Cleanup function: Clear the watch when the component unmounts
        return () => {
            if (watchId !== null) {
                console.log("Clearing location watch:", watchId);
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []); // Empty dependency array means run once on mount

    // Determine which icon is for whom based on role
    const myIconToUse = ownRole === 'user' ? userIconObj : driverIconObj;
    const otherIconToUse = ownRole === 'user' ? driverIconObj : userIconObj;

    // Render loading state until position is determined
    if (!myPosition) {
        return <div style={containerStyle}>Initializing Map...</div>; // Style loading div too
    }

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={() => setGoogleMapsLoaded(true)} // Set state when API loads
            onError={(e) => console.error("Google Maps script load error:", e)}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter} // Use mapCenter state for centering
                zoom={15}
                options={{ // Disable some controls for a cleaner look
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    zoomControl: true // Keep zoom control usually
                 }}
                // Optional: Recenter map if needed, maybe on prop change
                // onLoad={(map) => { if(myPosition) map.panTo(myPosition); }}
            >
                {/* Your Marker - Render only if position and icon are ready */}
                {myPosition && myIconToUse && (
                    <Marker position={myPosition} icon={myIconToUse} title="You" />
                )}

                {/* Other Party's Marker - Render only if location and icon are ready */}
                {otherPartyLocation && otherIconToUse && (
                    <Marker
                        position={otherPartyLocation}
                        icon={otherIconToUse}
                        title={ownRole === 'user' ? "Driver" : "User"}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default LiveTracking;