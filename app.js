const express = require('express');
const app = express();
const bodyParser     = require('body-parser');
const userRoutes = require('./routes/user.routes');
require('./database');
const morgan = require('morgan');


require('dotenv').config(); //handle passwords

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(morgan('dev'));

app.use('/user', userRoutes);


// middleware
app.use((req, res) => {
    console.log('The route is not correct');
    res.status(404).send("url not found");
});




app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
