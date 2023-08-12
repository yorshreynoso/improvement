const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const multer = require('multer'); //receive files
const upload = multer({dest: './upload/' });
const {hashPassword, comparePassword } = require('../controller/encryptation');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PASSWORD_JWT = process.env.PASSWORD_JWT;


router.get('/me', async (req, res) => {
    
    const token = req.headers['x-access-token'];

    if(!token) {
        return res.status(401).json({auth:false, message:" no token provided"});
    }

    const decode = jwt.verify(token, PASSWORD_JWT); // { id: '64d6de4b6050a3beaaae239c', iat: 1691803211, exp: 1691889611 }
    const user = await User.findById(decode.id, {password: 0});

    if(!user) {
        return res.status(404).send('user wasnt found');
    }

    res.json(user);

});

router.get('/all', async(req, res) => {
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
});

//done
router.get('/:_id', async (req, res) => {
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
});


//sign up - new user, register
router.post('/new',upload.single('image'), async (req, res) => { // sign up
    try {
        const { username, password } = req.body;
        const imagePath = req.file.path;
        const encryptedPassword = await hashPassword(password);
        
        const userData = {
            ...req.body,
            password: encryptedPassword,
            imagePath
        };

        const newUser = new User(userData); 
        const response = await newUser.save();

        const token = jwt.sign({ id: newUser._id }, PASSWORD_JWT, {
            expiresIn: 60 * 60 * 24
        });
        res.status(201).json({auth: true, token});
        //res.status(201).json(`the username ${username} was created correctly with id ${response._id}`);
        
    } catch (error) {
        console.error(`Error saving ${error}`);
        res.status(400).json(error)
    }
});

router.put('/update/:userId', upload.single('image'), async (req, res) => {
    let dataEncrypted = req.body;
    const { userId } = req.params;
    const { password } =  req.body; // this is not neccessary, mongoose check the differences.
    
    try {
        //validate if password is equal or not
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

});

router.delete('/delete/:userId', async(req, res) => {
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
});




module.exports = router;