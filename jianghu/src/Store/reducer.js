import * as constants from './actionTypes'

//默认数据
const defaultState = {
    adminInfo: {}, //管理员信息
    socket: null,
    chatList: [],
    onlineUserList: []
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
            const newState = {...state};
            newState.onlineUserList = action.onlineUserList;
            return newState;
        }
        case constants.SET_CHAT:{
            const newState = {...state};
            newState.chatList = action.chatList;
            return newState;
        }
        case constants.ADD_CHAT:{
            const newState = {...state};
            newState.chatList = [...newState.chatList, action.chatInfo];
            return newState;
        }
        default:
            return state
    }
}