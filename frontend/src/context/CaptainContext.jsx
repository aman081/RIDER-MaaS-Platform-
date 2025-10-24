import React, { createContext, useContext, useState } from 'react'

export const CaptainDataContext = createContext()

// export const useCaptain=()=>{
//     const context=useContext(CaptainContext);
//     if(!context) throw new Error("useCaptain must be used within CaptainContext");
//     return context;
// }

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState({
        fullname: {
            firstname: '',
            lastname: ''
        },
        email: '',
        socketId: '',
        vehicle: {
            color: '',
            plate: '',
            capacity: 0,
            Vehicletype: ''  // can be 'car', 'bike', or 'auto'
        },
        location: {
            lattitude: 0,
            longitude: 0
        }
    });

    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    const updateCaptain=(captainData)=>{
        setCaptain(captainData);
    }

    return (
        <div>
            <CaptainDataContext.Provider value={{ captain, setCaptain }}>
                {children}
            </CaptainDataContext.Provider>
        </div>
    )
}

export default CaptainContext
