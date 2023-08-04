const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


router.get('/all', (req, res) => {
    console.log('Getting all users');
    res.send('all information');
});

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

router.put('/update/:userId', (req, res) => {
    console.log(req.params.userId);
    const {userId} = req.params;
    const { username, email, firstName, lastName, phoneNumber, city, birthday, gender, password, active} =  req.body;

    console.log(`post: ${username}, modified`);
    res.send(`Id ${userId} received correctly`);
});

router.delete('/delete/:userId', (req, res) => {
    const { userId } = req.params;

    console.log(`The userId ${userId} was deleted correctly`);
    res.send('Deleted');
});

module.exports = router;