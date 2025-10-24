import React, { useEffect, useContext } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext.jsx'; // 2. You need CaptainContext
import axios from 'axios';

const CaptainLogout = () => {
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext); // 3. Get setCaptain from context
    const token = localStorage.getItem('token');

    // 4. Wrap ALL logic in a useEffect hook
    useEffect(() => {
        // We define an async function inside to perform the logout
        const performLogout = async () => {
            try {
                // 5. Only call the backend if a token actually exists
                if (token) {
                    // 6. Use the CAPTAIN logout endpoint
                    await axios.post(`http://${import.meta.env.VITE_API_URL}/captain/logout`, 
                    null, // Send null as the body
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            } catch (error) {
                // Log the error, but don't stop the logout.
                console.error("Server logout failed, logging out locally:", error);
            } finally {
                // 7. This 'finally' block runs on success OR failure
                localStorage.removeItem('token'); // Clear storage
                setCaptain(null);                 // 8. CRITICAL: Clear captain context state
                navigate('/CaptainLogin');        // 9. Redirect to CaptainLogin
            }
        };

        performLogout();

    }, [navigate, setCaptain, token]); // Add dependencies

    
    return null;
}

export default CaptainLogout;