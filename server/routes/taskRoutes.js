const router = require("express").Router();
const  protect  = require("../middleware/authMiddleware");
const {createTask,getProjectTasks,getTaskById,updateTask,deleteTask,assignTask,changeTaskStatus} = require("../controllers/taskController");

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


router.delete(
    "/:taskId",
    protect,
    deleteTask
);


router.post(
    "/:taskId/assign",
    protect,
    assignTask
);


router.patch(
    "/:taskId/status",
    protect,
    changeTaskStatus
);




module.exports = router;