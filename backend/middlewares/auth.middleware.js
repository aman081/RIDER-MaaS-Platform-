 const userModel=require("../models/user.model");
 const bcrypt=require('bcrypt');
 const jwt=require('jsonwebtoken');
 const blacklistTokenModel=require('../models/blacklistToken.model');

 module.exports.authUser=async(req,res,next)=>{

   const token=req.cookies.token || req.header('Authorization')?.split(' ')[1];
   if(!token){
        return res.status(401).json({message:'Unauthorized'});
   }

   const blacklistedtoken=await blacklistTokenModel.findOne({token});

   if(blacklistedtoken){
        return res.status(401).json({message:'Unauthorized'});
   }

   try{
           const decoded=jwt.verify(token,process.env.JWT_SECRET);
           const user=await userModel.findById(decoded._id);

           req.user=user;
           next();
   }catch(err){
        return res.status(401).json({message:'Unauthorized'});
   }


 }