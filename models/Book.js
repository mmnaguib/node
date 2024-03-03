const mongoose = require('mongoose');
const Joi = require('joi');

const BookSchema = new mongoose.Schema({
    title:  { type: String, required: true, trim: true, minlength: 3 },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Author' },
    price:  { type: Number, required: true},
    cover:  { type: String, required: true, enum: ["Soft","Hard"] },
}, {timestamps: true})
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(5).required(),
        author: Joi.string().trim().min(3).required(),
        price: Joi.number().positive().greater(0),
        cover: Joi.string().valid("Soft","Hard").required()
    })   
    return schema.validate(obj);
}
function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(5),
        author: Joi.string(),
        price: Joi.number().positive().greater(0),
        cover: Joi.string().valid("Soft","Hard").required()
    })   
    return schema.validate(obj);
}
const Book = mongoose.model("Book", BookSchema);
module.exports = {Book,validateCreateBook,validateUpdateBook}