const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const multer = require('multer'); //receive files
const upload = multer({dest: './upload/' });
const {hashPassword, comparePassword } = require('../controller/encryptation');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PASSWORD_JWT = process.env.PASSWORD_JWT;

const userController = require('../controller/user.controller');


router.get('/me', userController.me);

router.get('/all', userController.getUsers);

router.get('/:_id', userController.getUsersById );

//sign up - new user, register
router.post('/new',upload.single('image'), userController.createUser); // sign up

router.put('/update/:userId', upload.single('image'), userController.updateUserById );

router.delete('/delete/:userId', userController.deleteUserById );




module.exports = router;