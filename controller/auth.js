const jwt = require('jsonwebtoken');
const PASSWORD_JWT = process.env.PASSWORD_JWT;
const PASSWORD_JWT_REFRESH = process.env.PASSWORD_JWT_REFRESH

const tokenValidator = (req, res, next) => {

    const refreshToken = req.headers['refresh-token'];
    try {
        const token = req.headers["x-access-token"];
        if(!token) {
            return res.status(404).json({auth:"false", message:"No token provided"});
        }
        const decode = jwt.verify(token, PASSWORD_JWT);
        req.body._id = decode._id;

        next();
        
    } catch (error) {

        if(!refreshToken) {
            return res.status(404).json({auth:false, message:"No token provided"});
        } 
        
        try {
            const decodedRefresh = verifyRefresh(refreshToken);
            req.body._id = decodedRefresh._id;
            req.headers['x-access-token'] = createToken(decodedRefresh._id);
            next();
            
        } catch (error) {
            console.error('something happended, nice try');
            res.status(404).json({auth: false, refreshToken:false, message: "Error validation refresh"});
        }
    }
}


const createToken = ( _id ) => {
    return jwt.sign( { _id }, PASSWORD_JWT, {
        expiresIn: 60 * 4
    });
}

const createRefreshToken = (_id) => {
    return jwt.sign({ _id }, PASSWORD_JWT_REFRESH);
}

const verify = (token) => {
    const decoded = jwt.verify(token, PASSWORD_JWT);

    return decoded;
}

const verifyRefresh = (refreshToken) => {
    const decoded = jwt.verify(refreshToken, PASSWORD_JWT_REFRESH);

    return decoded;
}

module.exports = {tokenValidator, createToken, verify, createRefreshToken };
