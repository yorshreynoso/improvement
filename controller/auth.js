const jwt = require('jsonwebtoken');
const PASSWORD_JWT = process.env.PASSWORD_JWT;

const tokenValidator = (req, res, next) => {

    try {

        const token = req.headers["x-access-token"];
        if(!token) {
            return res.status(404).json({auth:"false", message:"No token provided"});
        }
        const decode = jwt.verify(token, PASSWORD_JWT);
        console.log(decode);
        req.body._id = decode._id;
        next();
        
    } catch (error) {
        console.error(`There is an error ${error}`);
        res.status(404).json({message: "Error trying to use token"});
    }
}


const createToken = ( _id ) => {
    return jwt.sign( { _id }, PASSWORD_JWT, {
        expiresIn: 60 * 4
    });
}

module.exports = {tokenValidator, createToken };
