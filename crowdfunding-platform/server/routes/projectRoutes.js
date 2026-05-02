import express from 'express';
import { getProjects, getProjectById, createProject, getMyProjects, getProjectInvestors, addProjectProfit, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProjects).post(protect, createProject);
router.route('/user/myprojects').get(protect, getMyProjects);
router.route('/:id').get(getProjectById).delete(protect, deleteProject);
router.route('/:id/investors').get(getProjectInvestors);
router.route('/:id/add-profit').post(protect, addProjectProfit);

export default router;
