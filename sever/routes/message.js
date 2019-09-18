import express from 'express'
const router = express.Router();
import MessageController from './../Mysql/Controller/Message.Controller'

router.get('/getAllMessages', MessageController.getAllMessages);
router.post('/addChat', MessageController.addChat);
router.post('/flagReadMoreMsg', MessageController.flagReadMoreMsg);

export default router
