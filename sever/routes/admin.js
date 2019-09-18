import express from 'express'
import AdminController from './../Mysql/Controller/Admin.Controller'
const router = express.Router();

router.post('/login', AdminController.adminLogin);
router.post('/reviseImg', AdminController.reviseImg);
router.post('/reviseInfo', AdminController.reviseInfo);
router.post('/updateToken', AdminController.updateToken);
router.post('/addAdmin', AdminController.addAdmin);
router.get('/getAdminList', AdminController.getAdminList);
router.get('/getAllAdminList', AdminController.getAllAdminList);
router.post('/updateJob', AdminController.updateJob);
router.post('/freezeAdmin', AdminController.freezeAdmin);
router.get('/getAdminInfo', AdminController.getAdminInfo);

export default router
