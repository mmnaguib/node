const express = require('express');
const router  = express.Router();
const asyncHandler = require('express-async-handler');
const { User, validateUpdateUSer} =  require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require('../middlewares/verifyToken');

router.get('/', verifyTokenAndAdmin,asyncHandler(async(req, res) => {
    const usersList = await User.find().select("-password");
    res.status(200).json(usersList);
}));

router.get('/:id',verifyTokenAndAuth, asyncHandler(async(req, res) => {
    const user = await  User.findById(req.params.id).select("-password");
    if(user){
        res.status(200).json({user});
    }else{
        res.status(404).json({Message: 'user not found!'});
    }
}));

router.put('/:id', verifyToken, verifyTokenAndAuth, asyncHandler(async (req,res)=>{
    const {error}=validateUpdateUSer(req.body);
    if(error){
        return  res.status(400).send(error.details[0].message);
    }
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        }
    }, {new: true}).select("-password");

    res.status(200).json(user);
    if(user){
        res.status(200).json({Message: 'user is Updated'});
    }else{
        res.status(404).json({Message: 'user not found!'});
    }
}));

router.delete('/:id',verifyTokenAndAuth,asyncHandler(async (req,res)=>{
    let user=await User.findById(req.params.id);
    if(user){
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({Message: 'user is deleted'});
    }else{
        res.status(404).json({Message: 'user not found!'});
    }
}))
module.exports = router