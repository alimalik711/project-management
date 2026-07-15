const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');


const { createProject, getMyProjects,getProjectById,updateProject,deleteProject,archiveProject,addMember,getProjectMembers,removeMember} = require('../controllers/projectController');


  
router.post('/',protect,createProject );
router.get('/',protect,getMyProjects );
router.get('/:projectId', protect, getProjectById);
router.put("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);
router.patch("/:projectId/archive", protect, archiveProject);
router.post("/:projectId/members", protect,addMember );
router.get("/:projectId/members", protect, getProjectMembers);
router.delete("/:projectId/members/:userid", protect, removeMember);



module.exports = router;