const userModel=require('../models/user.model');
const userServices=require('../services/user.services');
const {validationResult}=require('express-validator');
const blacklisttokenmodel=require('../models/blacklistToken.model');


module.exports.registerUser=async (req,res,next)=>{
      const errors=validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
      }

      const {fullname,email,password}=req.body;
      const alreadyExists=await userModel.findOne({email});
      if(alreadyExists){
          res.status(400).json({message:'User with this email already exists'});
          return;
      }

      const hashedPassword=await userModel.hashPassword(password);

      const user=await userServices.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
      });

      const token=user.generateToken();
      res.status(201).json({token,user});


}

module.exports.loginUser=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message:'Invalid email or password'});
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({message:"Invalid Password"});
    }

    const token=user.generateToken();
    res.cookie('token',token);
    res.status(200).json({token,user});
}

module.exports.getUserProfile=async(req,res,next)=>{
  res.status(200).json(req.user);
}

module.exports.logoutUser=async(req,res,next)=>{
   
   const token=req.cookies.token || req.header('Authorization').split(' ')[1];

   await blacklisttokenmodel.create({token});
   res.clearCookie('token');

   res.status(200).json({message:'Logged out successfully'});
}