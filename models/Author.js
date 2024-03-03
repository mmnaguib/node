const mongoose = require('mongoose');
const Joi = require('joi');

const AuthorSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true, minlength: 3 },
    last_name: { type: String, required: true, trim: true, minlength: 3  },
    nationality: { type: String, required: true, trim: true, minlength: 3  },
    image: { type: String, required: true, default: 'avatar.png'}
}, {timestamps: true});

// AuthorSchema.methods.getFullName = function () {
//     return `${this.first_name} ${this.last_name}`;
// };


function validateCreateAuthor(obj) {
    const schema = Joi.object({
        first_name: Joi.string().trim().min(3).required(),
        last_name: Joi.string().trim().min(3).required(),
        nationality: Joi.string().trim().min(3).required(),
        image: Joi.string().trim().min(3)
    })
    return schema.validate(obj);
}
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        first_name: Joi.string().trim().min(3),
        last_name: Joi.string().trim().min(3),
        nationality: Joi.string().trim().min(3),
        image: Joi.string().trim().min(3)
    })
    return schema.validate(obj);
}
const Author = mongoose.model("Author", AuthorSchema);
module.exports = {Author, validateCreateAuthor, validateUpdateAuthor}
