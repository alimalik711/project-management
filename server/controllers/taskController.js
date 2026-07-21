

const taskModel = require('../models/taskModel');

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            title,
            description,
            priority,
            due_date
        } = req.body;

        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = await taskModel.createTask(
            projectId,
            userId,
            title,
            description,
            priority,
            due_date
        );

        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



const getProjectTasks = async (req, res) => {

    try {

        const { projectId } = req.params;

        const { page = 1, limit = 10 } = req.query;

        const userId = req.user.id;

        const tasks = await taskModel.getProjectTasks(
            projectId,
            userId,
            Number(page),
            Number(limit)
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



const getTaskById = async (req, res) => {

    try {

        const { taskId } = req.params;
        const userId = req.user.userid; // or req.user.id

        const task = await taskModel.getTaskById(
            taskId,
            userId
        );

        return res.status(200).json({
            task
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const updateTask = async (req, res) => {

    try {

        const { taskId } = req.params;
        const userId = req.user.id; // or req.user.id

        const updatedTask = await taskModel.updateTask(
            taskId,
            userId,
            req.body
        );

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};




const deleteTask = async (req, res) => {

    try {

        const { taskId } = req.params;
        const userId = req.user.id; // or req.user.id

        await taskModel.deleteTask(taskId, userId);

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};


const assignTask = async (req, res) => {

    try {

        const { taskId } = req.params;
        const { userId } = req.body;

        const requesterId = req.user.id; // or req.user.id

        await taskModel.assignTask(
            taskId,
            requesterId,
            userId
        );

        return res.status(200).json({
            message: "Task assigned successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

const changeTaskStatus = async (req, res) => {

    try {

        const { taskId } = req.params;

        const { status } = req.body;

        const userId = req.user.id;

        const updatedTask = await taskModel.changeTaskStatus(
            taskId,
            userId,
            status
        );

        return res.status(200).json({
            message: "Task status updated successfully",
            task: updatedTask
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const searchTasks = async (req, res) => {

    try {

        const { projectId } = req.params;

        const { query } = req.query;

        const userId = req.user.id;

        const tasks = await taskModel.searchTasks(
            projectId,
            userId,
            query
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




const filterTasks = async (req, res) => {

    try {

        const { projectId } = req.params;

        const { status, priority } = req.query;

        const userId = req.user.id;

        const tasks = await taskModel.filterTasks(
            projectId,
            userId,
            status,
            priority
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



const sortTasks = async (req, res) => {

    try {

        const { projectId } = req.params;

        const { sortBy, order } = req.query;

        const userId = req.user.id;

        const tasks = await taskModel.sortTasks(
            projectId,
            userId,
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








module.exports
={
    createTask,getProjectTasks,getTaskById,updateTask,deleteTask,assignTask,changeTaskStatus,searchTasks,filterTasks
}