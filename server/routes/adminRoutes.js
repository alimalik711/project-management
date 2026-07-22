const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const adminController = require("../controllers/adminController");

router.get(
    "/users",
    protect,
    adminOnly,
    adminController.getAllUsers
);


router.patch(
    "/users/:userId/block",
    protect,
    adminOnly,
    adminController.blockUser
);


router.patch(
    "/users/:userId/unblock",
    protect,
    adminOnly,
    adminController.unblockUser
);

router.delete(
    "/users/:userId",
    protect,
    adminOnly,
    adminController.deleteUser
);



router.get(
    "/projects",
    protect,
    adminOnly,
    adminController.getAllProjects
);


router.get(
    "/tasks",
    protect,
    adminOnly,
    adminController.getAllTasks
);


module.exports = router;