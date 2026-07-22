

const pool = require('../config/db')

const getMyNotifications = async (userId) => {

    const notificationsResult = await pool.query(
        `SELECT *
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return notificationsResult.rows;

};


const markAsRead = async (
    notificationId,
    userId
) => {

    const updatedNotification = await pool.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
            notificationId,
            userId
        ]
    );

    const notification = updatedNotification.rows[0];

    if (!notification) {
        throw new Error("Notification not found or access denied");
    }

    return notification;

};

module.exports = {

    getMyNotifications , markAsRead
}