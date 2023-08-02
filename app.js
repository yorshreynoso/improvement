const express = require('express');
const app = express();
const postItRoutes = require('./routes/postit.routes');
const morgan = require('morgan');


require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));

app.use('/postit', postItRoutes)

// middleware
app.use((req, res) => {
    console.log('The route is not correct');
    res.status(404).send("url not found");
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
