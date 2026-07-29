const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');


const { getProfile, updateProfile, getAvatar, updateAvatar, changePassword } = require('../controllers/userController');

const avatarUpload = require("../middleware/avatarUpload")
  
router.get('/profile',protect, getProfile);
router.patch('/profile', (req, res, next) => {
  console.log('Profile PATCH route reached');
  next();
}, protect, updateProfile);
router.get('/avatar', protect, getAvatar);

router.patch(
    "/change-password",
    protect,
    changePassword
);

router.patch(
    "/avatar",
    protect,
    avatarUpload.single("avatar"),
    updateAvatar
);

module.exports = router;
