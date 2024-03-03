const express = require('express');
const router  = express.Router();
const asyncHandler = require('express-async-handler');
const { Book, validateCreateBook, validateUpdateBook } =  require('../models/Book');
const { verifyTokenAndAdmin} = require('../middlewares/verifyToken');
//Get All Books ..
router.get('/', asyncHandler(
    async (req, res) => {
        const books = await  Book.find().populate( 'author', ["_id", "first_name", "last_name"]); // populate author data from the
        res.status(200).json(books);
    }
));

//Get One Book ..
router.get('/:id', asyncHandler(
    async (req, res) => {
        const book = await Book.findById(req.params.id);
        if(book){
            res.status(200).json({book});
        }else{
            res.status(404).json({Message: 'Book not found!'});
        }
    }
));

//Create New Book ..
router.post('/', verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const {error} = validateCreateBook(req.body);
        if(error){
            return res.status(400).json({Message: error.details[0].message});
        }
        
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            price:  req.body.price,
            cover: req.body.cover,
        });
        const result = await book.save();
        res.status(201).json({result});
    }
));

//Update Book ..
router.put('/:id', verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const {error} = validateUpdateBook(req.body);
        if(error){
            return res.status(400).json({Message: error.details[0].message});
        }
        
        const book = await Book.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                author: req.body.author,
                price:  req.body.price,
                cover: req.body.cover,
            }
            }, {new: true});
            res.status(200).json(book);
            if(book){
                res.status(200).json({Message: 'Book is Updated'});
            }else{
                res.status(404).json({Message: 'Book not found!'});
            }
        }
    ));
    
    

//Delete Book ..
router.delete('/:id', verifyTokenAndAdmin,asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if(book){
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({Message: 'Book is deleted'});
    }else{
        res.status(404).json({Message: 'Book not found!'});
    }
}));
module.exports = router;