const captainModel=require('../models/captain.model');
const captainServices=require('../services/captain.services');
const {validationResult}=require('express-validator');
const blacklisttokenmodel=require('../models/blacklistToken.model');

module.exports.registerCaptain=async (req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()});
        }   
        const {fullname,email,password,vehicle,location}=req.body;

        const alreadyExists=await captainModel.findOne({email});
        if(alreadyExists){
            res.status(400).json({message:'Captain with this email already exists'});
            return;
        }

        const hashedPassword=await captainModel.hashPassword(password);

        const captain=await captainServices.createCaptain({ 
            firstname:fullname.firstname,
            lastname:fullname.lastname,
            email,
            password:hashedPassword,
            color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.Vehicletype,
            // lattitude:location.lattitude,
            // longitude:location.longitude


        });

        const token=captain.generateToken();
        res.status(201).json({token,captain});
    }


module.exports.loginCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }   

    const {email,password}=req.body;
    const captain=await captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(401).json({message:'Invalid email or password'});
    }
    const isMatch=await captain.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({message:"Invalid Password"});
    }

    const token=captain.generateToken();
    res.cookie('token',token);
    res.status(200).json({token,captain});
}  

module.exports.getCaptainProfile=async(req,res,next)=>{ 
    res.status(200).json(req.captain);
}

module.exports.logoutCaptain=async(req,res,next)=>{
  
   const token=req.cookies.token || req.header('Authorization').split(' ')[1];
    await blacklisttokenmodel.create({token});
     res.clearCookie('token');
    res.status(200).json({message:'Logged out successfully'});
}












