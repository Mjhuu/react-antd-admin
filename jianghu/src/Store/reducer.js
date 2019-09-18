import * as constants from './actionTypes'

//默认数据
const defaultState = {
    adminInfo: {}, //管理员信息
    socket: null,
    joinChatRoomList: [], // 加入的房间以及聊天信息
    onlineUsers: {},
    msgAudioPlayState: false,
    onlineAudioPlayState: false,
    color: { // 部门对应颜色
        id1: '#FA8C16',
        id3: '#FAAD14',
        id4: '#FADB14',
        id5: '#A0D911',
        id6: '#52C41A',
        id11: '#13C2C2',
        id12: '#1890FF',
        id13: '#2F54EB',
        id14: '#722ED1',
    }
};

export default (state = defaultState, action) =>{
    switch (action.type) {
        case constants.SET_ADMIN_INFO:{
            const newState = {...state};
            newState.adminInfo = action.adminInfo;
            return newState;
        }
        case constants.SET_SOCKET:{
            const newState = {...state};
            newState.socket = action.socket;
            return newState;
        }
        case constants.SET_ONLINE_LIST:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.onlineUsers = action.onlineUsers;
            if(newState.adminInfo.admin.uuid !== action.currentUser && action.kind === 1){
                // console.log('可以上线音效');
                newState.onlineAudioPlayState = true;
            }
            newState.socket = socket;
            return newState;
        }
        case constants.ADD_CHAT:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            let {joinChatRoomList} = newState;
            let index = joinChatRoomList.findIndex(joinChatRoom => joinChatRoom.chatRoomInfo.id === action.chatInfo.chatRoomId);
            newState.joinChatRoomList[index].allMsgList = [...newState.joinChatRoomList[index].allMsgList, action.chatInfo];
            //判断是否是当前用户发送的消息
            if(newState.adminInfo.admin.uuid !== action.chatInfo.uuid){
                newState.msgAudioPlayState = true;
                newState.joinChatRoomList[index].noReadMsgCount += 1;
            }
            newState.socket = socket;
            return newState;
        }
        case constants.CLEAR_MSG_COUNT:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.joinChatRoomList[action.index].noReadMsgCount = 0;
            newState.socket = socket;
            return newState;
        }
        case constants.ADD_CHAT_ROOM:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.joinChatRoomList = [...newState.joinChatRoomList, action.newChatRoom];
            newState.socket = socket;
            return newState;
        }
        case constants.RESET_ONLINE_AUDIO:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.onlineAudioPlayState = false;
            newState.socket = socket;
            return newState;
        }
        case constants.RESET_MSG_AUDIO:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.msgAudioPlayState = false;
            newState.socket = socket;
            return newState;
        }
        case constants.SET_JOIN_CHAT_ROOM_LIST:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            newState.joinChatRoomList = action.joinChatRoomList;
            newState.socket = socket;
            return newState;
        }
        case constants.REVISE_INFO:{
            let {socket} = state;
            delete state.socket;
            const newState = JSON.parse(JSON.stringify(state));
            for(let key in action.obj){
                if(action.obj.hasOwnProperty(key)){
                    newState.adminInfo.admin[key] = action.obj[key]
                }
            }
            newState.socket = socket;
            return newState;
        }
        default:
            return state
    }
}