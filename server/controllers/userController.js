
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const validator = require("validator");




const getProfile = async (req, res) => {
    try {
        const userId = req.user.userid; // Assuming the user ID is stored in req.user by the auth middleware
        
        const user = await userModel.getuserbyid(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found",
                user : req.user
             });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const updateProfile = async (req, res) => {
    try {
       
        
        const {name} = req.body;
        



        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        
        const userId = req.user.id// Assuming the user ID is stored in req.user by the auth middleware
        const updatedUser = await userModel.updateUserProfile(userId, name);

        if(!updatedUser)
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};







const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, req.user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        if (
            !validator.isStrongPassword(newPassword, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number, and symbol",
            });
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            req.user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from the current password",
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await userModel.changeUserPassword(
            req.user.id,
            hashedNewPassword
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};






module.exports = {
    getProfile,
    updateProfile,
    changePassword
};