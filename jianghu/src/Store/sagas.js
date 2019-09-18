import {put, takeEvery} from 'redux-saga/effects'
import * as constants from './actionTypes'
import {notification} from "antd";
import io from 'socket.io-client'
import store from "./index";
import {setOnlineList, setJoinChatRoomList, addChat} from "./actionCreators";

import * as ajax from './../Api/index'

/*function* setChat(action) {
    let data = yield ajax.getAllMessages();
    let chatList = [];
    if(data.code === 200){
        data.result.forEach(v =>{
            chatList.push({
                uuid: v.adminInfo.adminInfo.uuid,
                username: v.adminInfo.adminInfo.username,
                headImg: v.adminInfo.adminInfo.headImg,
                power: v.adminInfo.roleInfo.power,
                createTime: new Date(v.msgInfo.createTime).getTime(),
                msg: v.msgInfo.msg,
            })
        });
    }
    yield put({//异步转同步
        type: constants.SET_CHAT,
        chatList: chatList
    });
}*/

function* setSocket(action) {
    const socket = io.connect('http://localhost:3000/');
    let user = {
        uuid: action.uuid,
        username: action.username,
        headImg: action.headImg,
        power: action.power,
        joinChatRooms: []
    };
    socket.on('connect', async (data) => {
        console.log(data);
        let joinChatRoomListData = await ajax.getJoinRoomAndNoReadMsgCount();
        if(joinChatRoomListData.code === 200){
            let joinChatRoomList = joinChatRoomListData.result;
            let firstIndex = joinChatRoomList.findIndex(v => v.chatRoomInfo.type === 0);
            let firstChatRoom = joinChatRoomList.splice(firstIndex, 1);
            joinChatRoomList.unshift(...firstChatRoom);
            joinChatRoomList.forEach(joinChatRoom =>{
                let allMsgList = [];
                joinChatRoom.allMsgList.forEach(v=>{
                    allMsgList.push({
                        uuid: v.adminInfo.adminInfo.uuid,
                        username: v.adminInfo.adminInfo.username,
                        headImg: v.adminInfo.adminInfo.headImg,
                        power: v.adminInfo.roleInfo.power,
                        createTime: new Date(v.msgInfo.createTime).getTime(),
                        msg: v.msgInfo.msg,
                    })
                });
                joinChatRoom.allMsgList = allMsgList;
                user.joinChatRooms.push(joinChatRoom.chatRoomInfo.id);
            });
            store.dispatch(setJoinChatRoomList(joinChatRoomList));
        }
        // 1.1 打开通道
        socket.emit('open');
        // 发送上线通知
        socket.emit('online', JSON.stringify(user));
        socket.on('msg', data => {
            data = JSON.parse(data);
            console.log(data);
            switch (data.type) {
                case 0://系统消息
                    console.log('上线');
                    notification.info({
                        message: '系统消息：上线通知',
                        description: `${user.username} 已上线`,
                        duration: 3,
                    });
                    break;
                case 1://收到的是上线用户
                    let onlineUsers = data.result.onlineUsers;
                    Object.keys(onlineUsers).forEach(room =>{
                        onlineUsers[room].sort((a, b) => a.power - b.power);
                    });
                    // 管理员排在前
                    store.dispatch(setOnlineList({onlineUsers, currentUser: data.result.currentUser, kind: data.result.kind}));
                    break;
                case 2:
                    //全局收到消息添加到redux 并将未读消息+1
                    store.dispatch(addChat({
                        chatInfo: data.result
                    }));
                    break;
                default:
                    break;
            }
        });
    });
    yield put({//异步转同步
        type: constants.SET_SOCKET,
        socket
    });
}

function* mySaga() {
    yield takeEvery(constants.INIT_SOCKET, setSocket);
    // yield takeEvery(constants.INIT_CHAT, setChat);
}

export default mySaga;