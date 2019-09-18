import express from 'express'
import RoleController from './../Mysql/Controller/Role.Controller'
const router = express.Router();

router.get('/getAllRoleList', RoleController.getAllRoleList);

export default router
