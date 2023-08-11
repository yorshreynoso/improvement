require('dotenv').config();
const bcrypt = require('bcrypt');


const hashPassword = async(myPassword) => {
    const password = myPassword.toString();
    const saltRounds = Number(process.env.SALT_ROUNDS);

    try {
        const autoGenSalt = await bcrypt.genSalt(saltRounds); // saltRound must be a number, not string
        return await bcrypt.hash(password, autoGenSalt);

    } catch (error) {
        console.log(`There was some error trying to generate a hash, ${error}`);
    }
}

const comparePassword = async (myPassword , hashPassword) => {
    try {
        return await bcrypt.compare(String(myPassword), hashPassword);
        
    } catch (error) {
        console.log('Error comparing pass ', error);
    }
}

module.exports = {hashPassword, comparePassword };