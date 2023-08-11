require('dotenv').config();
const bcrypt = require('bcrypt');


const hashPassword = async(myPassword) => { 
    try {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const autoGenSalt = await bcrypt.genSalt(saltRounds); // saltRound must be a number, not string
        const hashedPassword = await bcrypt.hash(myPassword.toString(), autoGenSalt);
        return hashedPassword;

    } catch (error) {
        console.error(`Error generating hash: ${error}`);
    }
}

const comparePassword = async (inputPassword , hashPassword) => {
    try {
        const isMatch = await bcrypt.compare(String(inputPassword), hashPassword);
        return isMatch;
        
    } catch (error) {
        console.error(`Error comparing passwords: ${error}`);
    }
}

module.exports = {hashPassword, comparePassword };