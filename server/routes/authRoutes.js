const express = require('express');
const router = express.Router();


const { SignUp, Login } = require('../controllers/authController');
const { getProfile } = require('../controllers/userController');


router.post('/signup', SignUp);
router.post('/login', Login);   
router.get('/profile', getProfile);

module.exports = router;