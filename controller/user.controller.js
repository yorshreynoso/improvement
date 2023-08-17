const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const PASSWORD_JWT = process.env.PASSWORD_JWT;
const {hashPassword, comparePassword } = require('../controller/encryptation');
const { createToken, createRefreshToken, verify } = require('./auth');

require('dotenv').config();



const me = async(req, res) => {
    const token = req.headers['x-access-token'];

    if(!token) {
        return res.status(401).json({auth:false, message:" no token provided"});
    }

    const decode = jwt.verify(token, PASSWORD_JWT); // { id: '64d6de4b6050a3beaaae239c', iat: 1691803211, exp: 1691889611 }
    const user = await User.findById(decode.id, {password: 0});

    if(!user) {
        return res.status(404).send("user wasn't found");
    }

    res.json(user);
};

const meAuth = async(req, res) => {
    try {
        const token = req.headers['x-access-token'];

        if(!token) {
            return res.status(401).json({auth:false, message:" no token provided"});
        }
    
        const decode = jwt.verify(token, PASSWORD_JWT); // { id: '64d6de4b6050a3beaaae239c', iat: 1691803211, exp: 1691889611 }
        // console.log('decode', decode);
        const user = await User.findById(decode._id, {password: 0});

        res.json(user);

    } catch (error) {
        res.status(404).json({auth:false, message:"No token provided"});
    }
}

const getUsers = async(req, res ) => {
    try {
        const users = await User.find();

        if(users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(users);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
}


const getUsersById = async( req, res) => {
    try {
        const { _id } = req.params;
        const userFind = await User.findById(_id);

        if(!userFind) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userFind);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

const createUser = async(req, res) => {
    try {
        const imagePath = "";
        const { username, password } = req.body;
        if(req.file) {
            imagePath = req.file.path;
        }
        const encryptedPassword = await hashPassword(password);
        
        const userData = {
            ...req.body,
            password: encryptedPassword,
            imagePath
        };

        const newUser = new User(userData); 
        const response = await newUser.save();

        // TODO: AGREGAR ROLES DESPUES
        const token = createToken(newUser._id);
        const refreshToken = createRefreshToken(newUser._id);
        res.status(201).json({auth: true, token, refreshToken });
        
    } catch (error) {
        console.error(`Error saving ${error}`);
        res.status(400).json(error)
    }
}

const updateUserById = async (req, res) => {
    let dataEncrypted = req.body;
    const { userId } = req.params;
    const { password } =  req.body; // this is not neccessary, mongoose check the differences.
    
    try {
        //validate if password is equal or not, in case there is
        if(password) {
            const passwordEncryptedDatabase = await User.findById(userId);
            const passwordIsEqual = await comparePassword(password, passwordEncryptedDatabase.password);

            if(!passwordIsEqual) {
                const encryptedPassword = await hashPassword(password);
                dataEncrypted.password = encryptedPassword;
            } else {
                dataEncrypted.password = passwordEncryptedDatabase.password;
            }
        }
        
        const newUserResult = await User.findByIdAndUpdate(userId, dataEncrypted, {new: true}); // new:true return the new value instead of the old value

        res.send(`Id ${userId} received correctly`);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while modifying the user");
    }
}

const deleteUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser) {
            return res.status(404).send("The user wasn't found");
        }
        res.send('user deleted correctly');
        
    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        res.status(500).json({ message: "An error occurred while deleting the user" });
    }
}

module.exports = { me, getUsers, getUsersById, createUser, updateUserById, deleteUserById, meAuth };
