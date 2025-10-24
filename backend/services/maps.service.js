const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // --- 👇 THIS LINE IS LIKELY MISSING OR COMMENTED OUT ---
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    // --- 👆 ADD THIS LINE BACK ---

    try {
        // Now 'url' is defined when axios uses it
        const response = await axios.get(url);

        if (response.data.status === 'OK') {

            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            console.error("Google Places API Error:", response.data); // Keep this log for now
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error("Axios request failed:", err.message);
        if (err.response) {
             console.error("Google Places API Error (from catch):", err.response.data);
        }
        // It's better to re-throw the specific error message if available
        throw new Error(err.response?.data?.error_message || err.message || 'Unable to fetch suggestions');
    }
}

module.exports.getCaptainsInTheRadius = async (lat, lng, radiusKm) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radiusKm / 6371] // Earth's radius in km
            }
        }
    });

    return captains;
};

