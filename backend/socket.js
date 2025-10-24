const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors:{
        origin: process.env.FRONTEND_URL, // This must match the allowed domain
        methods: ['GET', 'POST'],
        credentials: true
    }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


    // Inside io.on('connection', ...) in socket.js

socket.on('update-location-captain', async (data) => {
    const { userId, location } = data;

    if (
        !userId ||
        !location ||
        location.type !== 'Point' ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2
    ) {
        console.error('Invalid GeoJSON location data:', data);
        return;
    }

    try {
        const updatedCaptain = await captainModel.findByIdAndUpdate(
            userId,
            { $set: { location } },
            { new: true }
        );

        if (updatedCaptain) {
            console.log(
                `✅ Updated location for captain ${userId}: [${location.coordinates[1]}, ${location.coordinates[0]}]`
            );
        } else {
            console.warn(`Captain ${userId} not found for location update.`);
        }
    } catch (error) {
        console.error(`Error updating location for captain ${userId}:`, error);
    }
});



        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };