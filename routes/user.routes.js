const express = require('express');
const router = express.Router();


router.get('/all', (req, res) => {
    console.log('Getting all users');
    res.send('all information');
});

router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    console.log(`The path variable userId is ${userId}`);
    res.send('Get well formed');
});


router.post('/new', (req, res) => {
    const { username, email, firstName, lastName, phoneNumber, city, birthday, gender, password, active } = req.body;

  
    console.log('correct, verify information');
    res.json("Information received correctly");
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