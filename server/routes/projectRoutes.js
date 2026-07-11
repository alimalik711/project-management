const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');


const {  } = require('../controllers/projectController');


  
router.get('/profile',protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;