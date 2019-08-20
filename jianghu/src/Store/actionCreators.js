import * as constants from './actionTypes'

//获取管理员信息
export const getAdminInfo = (obj)=>({
    type: constants.REQ_ADMIN_INFO,
    ...obj
});