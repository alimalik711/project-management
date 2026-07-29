const multer = require("multer");
const path = require("path");
const fs = require("fs");

const avatarDirectory = path.join(
    __dirname,
    "../uploads/avatars"
);

// Create uploads/avatars if it does not exist
if (!fs.existsSync(avatarDirectory)) {
    fs.mkdirSync(avatarDirectory, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, avatarDirectory);
    },

    filename: (req, file, callback) => {
        const uniqueName =
            `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;

        callback(null, uniqueName);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            )
        );
    }

    callback(null, true);
};

const avatarUpload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter
});

module.exports = avatarUpload;
