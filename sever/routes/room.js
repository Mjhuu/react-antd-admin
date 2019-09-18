import express from 'express'
const router = express.Router();
import ChatRoom from './../Mysql/Controller/ChatRoom.Controller'

router.get('/getJoinRoomAndNoReadMsgCount', ChatRoom.getJoinRoomAndNoReadMsgCount);
router.get('/getAllChatRooms', ChatRoom.getAllChatRooms);
router.post('/addRoom', ChatRoom.addRoom);
router.post('/joinChatRoom', ChatRoom.joinChatRoom);

export default router
