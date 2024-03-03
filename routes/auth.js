const express = require('express');
const router  = express.Router();
const asyncHandler = require('express-async-handler');
const { User, validateUserRegister, validateUserLogin} =  require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', asyncHandler(async(req, res) => {
    const {error} = validateUserRegister(req.body);
    if(error){
        return res.status(400).json({Message: error.details[0].message});
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({Message:'This email is already Existed'})
    }

    const salt = await  bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);

    user = new User({
        email : req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin:  req.body.isAdmin,
    });

    const result = await user.save();
    const token = user.generateToken();
    const {password, ...others} = result._doc;
    res.status(201).json({...others, token});
}
));

router.post('/login', asyncHandler(async(req, res) => {
    const {error} = validateUserLogin(req.body);
    if(error){
        return res.status(400).json({Message: error.details[0].message});
    }

    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({Message:'Email or Password is incorrect'})
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({ Message: 'Email or Password is incorrect.' })
    }

    const token = user.generateToken();
    const {password, ...others} = user._doc;
    res.status(201).json({...others, token});
}
));

module.exports = router