import * as constants from './actionTypes'

//获取管理员信息
export const setAdminInfo = (obj) => ({
    type: constants.SET_ADMIN_INFO,
    adminInfo: obj
});

//获取管理员信息
export const setOnlineList = (onlineUsers) => ({
    type: constants.SET_ONLINE_LIST,
    onlineUserList: onlineUsers
});

//初始化socket
export const initSocket = obj => ({
    type: constants.INIT_SOCKET,
    ...obj
});

// 初始化聊条记录
export const initChat = obj => ({
   type: constants.INIT_CHAT,
   ...obj
});

// 新增消息记录
export const addChat = obj => ({
    type: constants.ADD_CHAT,
    chatInfo: obj.chatInfo
});
