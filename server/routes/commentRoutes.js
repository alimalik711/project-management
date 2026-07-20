const router = require("express").Router();
const  protect  = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

router.post(
    "/task/:taskId",
    protect,
    commentController.createComment
);

router.get(
    "/task/:taskId",
    protect,
    commentController.getTaskComments
);

router.patch(
    "/:commentId",
    protect,
    commentController.updateComment
);

router.delete(
    "/:commentId",
    protect,
    commentController.deleteComment
);


module.exports = router;