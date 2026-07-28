const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.getUserById(
            decoded.userid
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.is_blocked) {
            return res.status(403).json({
                message: "Blocked by admin"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = 
    protect
