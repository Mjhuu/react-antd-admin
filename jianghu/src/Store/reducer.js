import * as constants from './actionTypes'

//默认数据
const defaultState = {
    adminInfo: {}, //管理员信息
};

export default (state = defaultState, action) =>{
    if(action.type === constants.GET_ADMIN_INFO){
        const newState = JSON.parse(JSON.stringify(state));
        newState.adminInfo = action.adminInfo;
        return newState;
    }
    return state;
}