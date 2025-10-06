const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const e = require('express');

const captainSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name should be atleast 3 characters long'],
        },

          lastname:{
            type:String,
            minlength:[3,'Last name should be atleast 3 characters long'], 
        }
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    vehicle:{
        color:{
        type:String,
        required:true,
        minlength:[3,'Color should be atleast 3 characters long']
    },
        plate:{
        type:String,
        required:true,
        minlength:[3,'Plate number should be atleast 3 characters long']
    },
        capacity:{
        type:Number,
        required:true,
        min:[1,'Capacity should be atleast 1']
    },
        
        Vehicletype:{
        type:String,
        required:true,
        enum:['car','bike','auto']
        }
    },          
    location:{
        lattitude:{
            type:Number,
        },
        longitude:{
            type:Number,
        }
    }
});

captainSchema.methods.generateToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
}

captainSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}   

captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}
const CaptainModel =mongoose.model('CaptainModel',captainSchema);

module.exports=CaptainModel;