const adminModel = require("../models/adminModel");

const getAllUsers = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            order = "DESC"
        } = req.query;

        const users = await adminModel.getAllUsers(
            Number(page),
            Number(limit),
            search,
            sortBy,
            order
        );

        return res.status(200).json({
            users
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const blockUser = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await adminModel.blockUser(userId);

        return res.status(200).json({
            message: "User blocked successfully",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const unblockUser = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await adminModel.unblockUser(userId);

        return res.status(200).json({
            message: "User unblocked successfully",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const deleteUser = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await adminModel.deleteUser(userId);

        return res.status(200).json({
            message: "User deleted successfully",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            message: error.message
        });

    }

};


const getAllProjects = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            order = "DESC"
        } = req.query;

        const projects = await adminModel.getAllProjects(
            Number(page),
            Number(limit),
            search,
            sortBy,
            order
        );

        return res.status(200).json({
            projects
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const getAllTasks = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            order = "DESC"
        } = req.query;

        const tasks = await adminModel.getAllTasks(
            Number(page),
            Number(limit),
            search,
            sortBy,
            order
        );

        return res.status(200).json({
            tasks
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const getDashboardStats = async (req, res) => {

    try {

        const stats = await adminModel.getDashboardStats();

        return res.status(200).json(stats);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};






module.exports = {
    getAllUsers,blockUser,unblockUser,deleteUser,getAllProjects,getAllTasks,,getDashboardStats
};