import React, { useEffect, useContext } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext.jsx'; // 2. You need useContext
import axios from 'axios';

const UserLogout = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext); // 3. Get setUser from context
    const token = localStorage.getItem('token');

    // 4. Wrap ALL logic in a useEffect hook
    useEffect(() => {
        // We define an async function inside to perform the logout
        const performLogout = async () => {
            try {
                // 5. Only call the backend if a token actually exists
                if (token) {
                    await axios.post(`http://${import.meta.env.VITE_API_URL}/user/logout`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            } catch (error) {
                // Log the error, but don't stop the logout.
                // The user wants to log out, so we log them out on the frontend
                // even if the backend call fails.
                console.error("Server logout failed, logging out locally:", error);
            } finally {
                // 6. This 'finally' block runs on success OR failure
                localStorage.removeItem('token'); // Clear storage
                setUser(null);                   // 7. CRITICAL: Clear context state
                navigate('/UserLogin');          // 8. Redirect
            }
        };

        performLogout();

    }, [navigate, setUser, token]); // Add dependencies

    
    return null;
}

export default UserLogout;