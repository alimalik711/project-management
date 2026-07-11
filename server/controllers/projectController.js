
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

        res.status(201).json({ message: "Project created successfully", project });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }   

};  
