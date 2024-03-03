const jwt = require('jsonwebtoken');

function verifyToken (req, res, next) {
    const token = req.headers.token;
    
    if (token){
        try{
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        }catch(err){
            return res.status(403).send({ message: 'Invalid token.' })
        }
    }else {
        return res.status(403).send({ message: 'No token provided.' })
    };
}

function verifyTokenAndAuth(req, res, next) {
    verifyToken (req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({Message: 'Not Allowed To Edit'});
        }
    });
}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken (req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json({Message: 'Not Allowed, Only Admin'});
        }
    });
}

module.exports = {verifyToken,verifyTokenAndAuth,verifyTokenAndAdmin};