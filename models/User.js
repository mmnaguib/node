const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    email:     {type:String, required:true, trim:true,minlength: 3, unique: true},
    username:  {type:String, required:true, trim:true,minlength: 3},
    password:  {type:String, required:true, trim:true,minlength: 6},
    isAdmin:   {type:Boolean, default:false}
}, {timestamps: true});

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.SECRET_KEY);
}
function validateUserRegister(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(3).required().email(),
        username: Joi.string().trim().min(3).required(),
        password: Joi.string().trim().min(6).required(),
        isAdmin: Joi.bool(),
    })
    return schema.validate(obj);
}
function validateUserLogin(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(3).email().required(),
        password: Joi.string().trim().min(6).required()
    })
    return schema.validate(obj);
}

function validateUpdateUSer(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(3).email(),
        username: Joi.string().trim().min(3),
        password: Joi.string().trim().min(6),
        isAdmin: Joi.bool(),
    })
    return schema.validate(obj);
}

const User = mongoose.model('User', userSchema);

module.exports = {User, validateUserRegister, validateUserLogin, validateUpdateUSer}