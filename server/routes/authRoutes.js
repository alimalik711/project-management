const express = require('express');
const router = express.Router();


const { SignUp, Login ,logout} = require('../controllers/authController');

const protect = require("../middleware/authMiddleware")


router.post('/signup', SignUp);
router.post('/login', Login);   

router.post("/logout", protect, logout);



module.exports = router;