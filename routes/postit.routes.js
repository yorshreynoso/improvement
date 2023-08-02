const express = require('express');
const router = express.Router();


router.get('/all', (req, res) => {
    console.log('Getting all informtion');
    res.send('all information');
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`The path variable id is ${id}`);
    res.send('Get well formed');
});


router.post('/new', (req, res) => {
    const {post, song} = req.body;

    const information = {
        post,
        song
    }
    console.log(information);
    res.json("Information received correctly");
});

router.put('/update/:id', (req, res) => {
    console.log(req.params.id);
    const {id} = req.params;
    const { post, details } =  req.body;

    console.log(`post: ${post}, details: ${details}`);
    res.send(`Id ${id} received correctly`);
});

router.delete('/delete/:id', (req, res) => {
    const {id } = req.params;

    console.log(`The id ${id} was deleted correctly`);
    res.send('Deleted');
});

module.exports = router;