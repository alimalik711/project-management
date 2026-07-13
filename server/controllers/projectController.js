
const projectModel = require('../models/projectModel');



const createProject = async (req, res) => {

    try {
        const { name, description , deadline} = req.body;

        if(!name)
        {
            return res.status(400).json({ message: "Project name is required" });
        
        }

        const ownerId = req.user.id;
        
        const project = await projectModel.createProject(name, description, deadline, ownerId);

        return res.status(201).json({ message: "Project created successfully", project });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }   

};  



const getMyProjects = async (req, res) => {

    try {
        

        const userid= req.user.id;
        
        const project = await projectModel.getMyProjects(userid);

        return res.status(200).json({ message: "Project fetched successfuly", project });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }   

};  




const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await projectModel.getProjectById(projectId, userId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        return res.status(200).json({
            project,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, deadline, status } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required",
            });
        }

        const userId = req.user.id;

        const project = await projectModel.updateProject(
            projectId,
            userId,
            name,
            description,
            deadline,
            status
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner",
            });
        }

        return res.status(200).json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};




const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await projectModel.deleteProject(projectId, userId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner",
            });
        }

        return res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


const archiveProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await projectModel.archiveProject(projectId, userId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner",
            });
        }

        return res.status(200).json({
            message: "Project archived successfully",
            project,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};



module.exports
=
{
    createProject,getMyProjects,getProjectById,updateProject,deleteProject,archiveProject
}