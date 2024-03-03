const express = require('express');
const router  = express.Router();
const asyncHandler = require('express-async-handler');
const { Author, validateCreateAuthor, validateUpdateAuthor } =  require('../models/Author');
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require('../middlewares/verifyToken');

//Get All authors ..
router.get('/', asyncHandler(
    async (req, res) => {
        const  authors = await Author.find();
        res.status(200).send(authors);
    }
));

//Get One author ..
router.get('/:id', asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if(author){
            res.status(200).json({author});
        }else{
            res.status(404).json({Message: 'author not found!'});
        }
    }
));

//Create New author ..
router.post('/', verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const {error} = validateCreateAuthor(req.body);
        if(error){
            return res.status(400).json({Message: error.details[0].message});
        }
        const author = new Author({ 
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            nationality: req.body.nationality,
            image: req.body.image
        });
    
        const result = await author.save();
        res.status(201).json({result});
        
    }
));

//Update author ..
router.put('/:id', verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const {error} = validateUpdateAuthor(req.body);
        if(error){
            return res.status(400).json({Message: error.details[0].message});
        }
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                nationality: req.body.nationality,
                image: req.body.image
            }
        }, {new: true});
    
        res.status(200).json(author);
        if(author){
            res.status(200).json({Message: 'author is Updated'});
        }else{
            res.status(404).json({Message: 'author not found!'});
        }
    }
));

//Delete author ..
router.delete('/:id', verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if(author){
            await Author.findByIdAndDelete(req.params.id);
            res.status(200).json({Message: 'author is deleted'});
        }else{
            res.status(404).json({Message: 'author not found!'});
        }
    
    }
));

module.exports = router;