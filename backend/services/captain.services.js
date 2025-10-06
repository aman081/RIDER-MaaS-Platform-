const captainModel=require('../models/captain.model');

module.exports.createCaptain= async({firstname,lastname,email,password,color,plate,capacity,vehicleType,lattitude,longitude})=>{
    if(!firstname || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error('All fields are required');
    }

    const newcaptain=captainModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,  
        password,
        vehicle:{
            color,
            plate,  
            capacity,
            Vehicletype:vehicleType
        },
        location:{
            lattitude,
            longitude
        }

    });

    return newcaptain;
}