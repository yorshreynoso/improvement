const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


router.get('/all', async(req, res) => {
    try {
        const users = await User.find();
        console.log(users);
        if(users) {
            res.json(users)
        } else {
            res.status(404).send('no Users found');
        }
        
    } catch (error) {
        console.log(error);
        res.status(404).send("There was an error trying to get all users");
    }
});

//done
router.get('/:_id', async(req, res) => {
    const { _id } = req.params;

    try {
        const userFind = await User.findById(_id);
        res.json(userFind);
        
    } catch (error) {
        res.status(404).send('The user was not found');
    }
    
});


//done
router.post('/new', async (req, res) => {
    let response = '';
    let newUser = '';
    const { username, email, firstName, lastName, phoneNumber, city, birthday, gender, password, active } = req.body;

    console.log(User);

    try {
        newUser = await User(req.body);
        
        response = await newUser.save();
        res.status(201).json(`the username ${response.username} was created correctly`);
        
    } catch (error) {
        console.log(`Error saving ${error}`);
        res.status(400).json(error)
    }
});

router.put('/update/:userId', async(req, res) => {
    console.log(req.params.userId);
    const { userId } = req.params;
    const { username, email, firstName, lastName, phoneNumber, city, birthday, gender, password, active} =  req.body; // this is not neccessary, mongoose check the differences.

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {upsert: false});
        console.log(`post: ${updatedUser}, modified`);
        res.send(`Id ${userId} received correctly`);
        
    } catch (error) {
        console.log(error);
        res.status(404).send('The user wasnt modified correctly');
    }

});

router.delete('/delete/:userId', async(req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if(deletedUser) {
            return res.send('user deleted correctly');
        }
        return res.status(404).send("the user wasn't found");
        
    } catch (error) {
        console.log(`There were a problem trying to delete de user`);
        res.status(404).send("the user wasn't deleted");
    }
});

module.exports = router;