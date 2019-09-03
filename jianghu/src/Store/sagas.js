import {put, takeEvery} from 'redux-saga/effects'
import * as constants from './actionTypes'
import {notification} from "antd";
import io from 'socket.io-client'
import store from "./index";
import {setOnlineList} from "./actionCreators";

import * as ajax from './../Api/index'

function* setChat(action) {
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
}

function* setSocket(action) {
    const socket = io.connect('http://localhost:3000/');
    let user = {
        uuid: action.uuid,
        username: action.username,
        headImg: action.headImg,
        power: action.power
    };
    socket.on('connect', (data) => {
        console.log(data);
        // 1.1 打开通道
        socket.emit('open');
        // 发送上线通知
        socket.emit('online', JSON.stringify(user));
        socket.on('msg', data => {
            data = JSON.parse(data);
            switch (data.type) {
                case 0://系统消息
                    notification.info({
                        message: '系统消息：上线通知',
                        description: `${user.username} 已上线`,
                        duration: 3,
                    });
                    break;
                case 1://收到的是上线用户
                    let onlineUsers = data.result.onlineUsers;
                    // 管理员排在前
                    onlineUsers.sort((a, b) => a.power - b.power);
                    store.dispatch(setOnlineList(onlineUsers));
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
    yield takeEvery(constants.INIT_CHAT, setChat);
}

export default mySaga;