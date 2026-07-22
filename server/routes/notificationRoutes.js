
const router = require("express").Router();
const  protect  = require("../middleware/authMiddleware");


const notificationController = require('../controllers/notificationController');



router.get(
    "/",
    protect,
    notificationController.getMyNotifications
);


router.patch(
    "/:notificationId/read",
    protect,
    notificationController.markAsRead
);

router.patch(
    "/read-all",
    protect,
    notificationController.markAllAsRead
);

module.exports = router

