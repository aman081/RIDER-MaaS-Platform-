const express=require('express');
const router=express.Router();
const {body}=require('express-validator');

const userController=require('../controllers/user.controller');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname shoild be atleast 3 characters'),
    body('password').isLength({min:5}).withMessage('password should be atleast 5 characters')
],userController.registerUser);


module.exports=router;