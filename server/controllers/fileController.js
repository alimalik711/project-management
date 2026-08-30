


const fileModel = require("../models/fileModel");

const uploadFile = async (req, res) => {

    try {

        const { taskId } = req.params;

        const userId = req.user.id;

        const file = req.file;

        const uploadedFile = await fileModel.uploadFile(
            taskId,
            userId,
            file
        );

        return res.status(201).json({
            message: "File uploaded successfully",
            file: uploadedFile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const getTaskFiles = async (req, res) => {

    try {

        const { taskId } = req.params;

        const userId = req.user.id;

        const files = await fileModel.getTaskFiles(
            taskId,
            userId
        );

        return res.status(200).json({
            files
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const deleteFile = async (req, res) => {

    try {

        const { fileId } = req.params;

        const userId = req.user.id;

        await fileModel.deleteFile(
            fileId,
            userId
        );

        return res.status(200).json({
            message: "File deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    uploadFile,
    getTaskFiles,
     deleteFile
};