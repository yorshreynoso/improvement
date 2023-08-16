const express = require('express');
const router = express.Router();
const multer = require('multer'); //receive files
const upload = multer({dest: './upload/' });
require('dotenv').config();
const {tokenValidator} = require('../controller/auth');

const userController = require('../controller/user.controller');


router.get('/me', userController.me);
router.get('/auth', tokenValidator, userController.meAuth); // test

router.get('/all', userController.getUsers);

router.get('/:_id', userController.getUsersById );

//sign up - new user, register
router.post('/new',upload.single('image'), userController.createUser); // sign up

router.put('/update/:userId', upload.single('image'), userController.updateUserById );

router.delete('/delete/:userId', userController.deleteUserById );




module.exports = router;