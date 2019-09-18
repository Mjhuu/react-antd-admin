import {reqIpAndAddress} from "../ajax";
import Jwt from "../jwt";
import Model from "../Mysql/main";

export const getIpAndAddress = async (req)=>{
    let ip = req.ip.split(':').pop();
    let res = await reqIpAndAddress({
        key: 'RUDBZ-4SML6-MY2SQ-M57GK-YRW7V-55F2S',
        // ip //上线时打开
    });
    if (res.status === 0) {
        return res.result
    } else {
        return {code: 500, data: '获取ip地址失败'}
    }
};

export const getAdminId = async (req, res, next)=>{
    let uuid = new Jwt(req.headers.token).verifyToken().adminId;
    let admin = await Model.Admin.findOne({
        where: {uuid},
    }).catch(err => next({res: err, msg: '获取技术人员信息失败'}));
    if(!admin){
        return next({msg: '暂无此技术人员'})
    }
    return admin.id
};
