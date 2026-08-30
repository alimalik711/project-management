const commentModel = require("../models/commentModel");

const createComment = async (req, res) => {

    try {

        const { taskId } = req.params;
        const { content } = req.body;

        const userId = req.user.id;

        const comment = await commentModel.createComment(
            taskId,
            userId,
            content
        );

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const getTaskComments = async (req, res) => {

    try {

        const { taskId } = req.params;

        const userId = req.user.id;

        const comments = await commentModel.getTaskComments(
            taskId,
            userId
        );

        return res.status(200).json(comments);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const updateComment = async (req, res) => {

    try {

        const { commentId } = req.params;
        const { content } = req.body;

        const userId = req.user.id;

        const comment = await commentModel.updateComment(
            commentId,
            userId,
            content
        );

        return res.status(200).json({
            message: "Comment updated successfully",
            comment
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const deleteComment = async (req, res) => {

    try {

        const { commentId } = req.params;

        const userId = req.user.id;

        await commentModel.deleteComment(
            commentId,
            userId
        );

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



module.exports = {
    createComment,
    getTaskComments,
    updateComment,
    deleteComment,
};