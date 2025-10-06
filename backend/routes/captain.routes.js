const captainController=require('../controllers/captain.controller');
const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const authMiddleware=require('../middlewares/auth.middleware');


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname shoild be atleast 3 characters'),
    body('password').isLength({min:5}).withMessage('password should be atleast 5 characters'),
    body('vehicle.color').isLength({min:3}).withMessage('Color should be atleast 3 characters'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate number should be atleast 3 characters'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Capacity should be atleast 1'),
    body('vehicle.Vehicletype').isIn(['car','bike','auto']).withMessage('Vehicle type should be car, bike or auto'),

],captainController.registerCaptain);   

router.post('/login',[
      body('email').isEmail().withMessage('Invalid Email'),
],captainController.loginCaptain);

router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile);
router.post('/logout',authMiddleware.authCaptain,captainController.logoutCaptain);



module.exports=router;