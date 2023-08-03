const mongoose = require('mongoose');
require('dotenv').config();

const PASSWORD_DB = process.env.PASSWORD_DB;
const USER_DB = process.env.USER_DB;

const uri = `mongodb+srv://${USER_DB}:${PASSWORD_DB}@cluster0.fsxsycz.mongodb.net/`;

// option configuration
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


// Immediately invoked function execution IIFE
(async() => {
    try {
        await mongoose.connect(uri, options);
        console.log('Connection successfully');
        
    } catch (error) {
        console.log(`Error Trying to connect, ${error}`);
    }

})();