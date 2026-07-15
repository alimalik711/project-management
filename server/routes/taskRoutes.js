const router = require("express").Router();
const  protect  = require("../middleware/authMiddleware");
const {createTask,getProjectTasks,getTaskById,updateTask} = require("../controllers/taskController");

// Create Task
router.post(
    "/project/:projectId",
    protect,
    createTask
);

// Get All Tasks of a Project
router.get(
    "/project/:projectId",
    protect,
   getProjectTasks
);

router.get(
    "/:taskId",
    protect,
    getTaskById
);

router.patch(
    "/:taskId",
    protect,
    updateTask
);









module.exports = router;