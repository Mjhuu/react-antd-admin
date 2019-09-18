import * as constants from './actionTypes'

//获取管理员信息
export const setAdminInfo = (obj) => ({
    type: constants.SET_ADMIN_INFO,
    adminInfo: obj
});
//修改用户信息
export const reviseUserInfo = obj =>({
   type: constants.REVISE_INFO,
   obj
});

export const setJoinChatRoomList = obj =>({
    type: constants.SET_JOIN_CHAT_ROOM_LIST,
    joinChatRoomList: obj
});

//获取管理员信息
export const setOnlineList = (obj) => ({
    type: constants.SET_ONLINE_LIST,
    ...obj
});

//初始化socket
export const initSocket = obj => ({
    type: constants.INIT_SOCKET,
    ...obj
});

/*
// 初始化聊条记录
export const initChat = obj => ({
   type: constants.INIT_CHAT,
   ...obj
});
*/

// 新增聊天室
export const addChatRoom = obj => ({
    type: constants.ADD_CHAT_ROOM,
    ...obj
});
// 新增消息记录
export const addChat = obj => ({
    type: constants.ADD_CHAT,
    ...obj
});
// 清空未读记录
export const clearMsgCount = obj => ({
    type: constants.CLEAR_MSG_COUNT,
    ...obj
});

//重置音效
export const resetOnlineAudio = obj => ({
    type: constants.RESET_ONLINE_AUDIO,
    ...obj
});
export const resetMsgAudio = obj => ({
    type: constants.RESET_MSG_AUDIO,
    ...obj
});
