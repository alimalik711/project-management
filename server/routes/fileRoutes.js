const upload = require("../middleware/uploadMiddleware");

const router = require("express").Router();
const protect = require('../middleware/authMiddleware')
const fileController = require('../controllers/fileController')

router.post(
    "/task/:taskId",
    protect,
    upload.single("file"),
    fileController.uploadFile
);


router.get(
    "/task/:taskId",
    protect,
    fileController.getTaskFiles
);


router.delete(
    "/:fileId",
    protect,
    fileController.deleteFile
);




module.exports = router;