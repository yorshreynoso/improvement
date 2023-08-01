const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/all', (req, res) => {
    console.log('Getting all informtion');
    res.send('all information');
});

app.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`The path variable id is ${id}`);
    res.send('Get well formed');
});


app.post('/new', (req, res) => {
    const {post, song} = req.body;

    const information = {
        post,
        song
    }
    console.log(information);
    res.json("Information received correctly");
});

app.put('/:id', (req, res) => {
    console.log(req.params.id);
    const {id} = req.params;
    const { post, details } =  req.body;

    console.log(`post: ${post}, details: ${details}`);
    res.send(`Id ${id} received correctly`);
});

app.delete('/delete/:id', (req, res) => {
    const {id } = req.params;

    console.log(`The id ${id} was deleted correctly`);
    res.send('Deleted');
})


//middleware
app.use((req, res) => {
    console.log('vientos');
    res.send('okas');
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
