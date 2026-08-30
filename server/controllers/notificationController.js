const notificationModel = require("../models/notificationModel");

const getMyNotifications = async (req, res) => {

    try {

        const userId = req.user.id;

        const notifications = await notificationModel.getMyNotifications(
            userId
        );

        return res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const markAsRead = async (req, res) => {

    try {

        const { notificationId } = req.params;

        const userId = req.user.id;

        const notification = await notificationModel.markAsRead(
            notificationId,
            userId
        );

        return res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const markAllAsRead = async (req, res) => {

    try {

        const userId = req.user.id;

        const notifications = await notificationModel.markAllAsRead(userId);

        return res.status(200).json({
            message: "All notifications marked as read",
            notifications
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};




module.exports = {getMyNotifications,markAsRead,markAllAsRead}