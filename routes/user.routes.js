const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const multer = require('multer'); //receive files
const upload = multer({dest: './upload/' });
const {hashPassword, comparePassword } = require('../controller/encryptation');


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


//done
router.post('/new',upload.single('image'), async (req, res) => {
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

        res.status(201).json(`the username ${username} was created correctly with id ${response._id}`);
        
    } catch (error) {
        console.error(`Error saving ${error}`);
        res.status(400).json(error)
    }
});

router.put('/update/:userId', upload.single('image'), async (req, res) => {
    const { userId } = req.params;
    const { password } =  req.body; // this is not neccessary, mongoose check the differences.
    
    let dataEncrypted = req.body;
    
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