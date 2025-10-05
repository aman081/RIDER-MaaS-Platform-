const express=require('express');
const router=express.Router();
const {body}=require('express-validator');

const userController=require('../controllers/user.controller');
const user = require('../models/user.model');
const authMiddleware=require('../middlewares/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname shoild be atleast 3 characters'),
    body('password').isLength({min:5}).withMessage('password should be atleast 5 characters')
],userController.registerUser);

router.post('/login',[
      body('email').isEmail().withMessage('Invalid Email'),
],userController.loginUser);

router.get('/profile',authMiddleware.authUser,userController.getUserProfile);
router.post('/logout',authMiddleware.authUser,userController.logoutUser);


module.exports=router;