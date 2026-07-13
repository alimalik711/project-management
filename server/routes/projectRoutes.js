const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');


const { createProject, getMyProjects,getProjectById,updateProject,deleteProject,archiveProject} = require('../controllers/projectController');


  
router.post('/',protect,createProject );
router.get('/',protect,getMyProjects );
router.get('/:projectId', protect, getProjectById);
router.put("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);
router.patch("/:projectId/archive", protect, archiveProject);

module.exports = router;