



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
        const userId = req.user.id;   // or req.user.id, depending on your JWT payload

        const tasks = await taskModel.getProjectTasks(
            projectId,
            userId
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
        const userId = req.user.userid; // or req.user.id

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






module.exports
={
    createTask,getProjectTasks,getTaskById,updateTask
}