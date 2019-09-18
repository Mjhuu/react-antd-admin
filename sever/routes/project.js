import express from 'express'
import ProjectController from './../Mysql/Controller/Project.Controller'
const router = express.Router();

router.get('/getProjectList', ProjectController.getProjectList);
router.post('/delProject', ProjectController.delProject);
router.post('/addProject', ProjectController.addProject);

export default router
