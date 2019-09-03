import Jwt from './../jwt'
import Model from "../Mysql/main";

export default async function (req, res, next) {
    if (!req.url.includes('/admin/login') && !req.url.includes('/socket.io')) {
        let token = req.headers.token;
        if (!token) {
            return res.send({code: 403, data: '您无权访问此接口！'});
        }
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        if (result === 'err') {
            res.send({code: 403, data: '登录已过期,请重新登录'});
        } else { // token未过期
            let uuid = result.adminId;
            // 查询管理员信息
            let admin = await Model.Admin.findOne({where: {uuid}}).catch(err => next({res: err, msg: '获取管理员信息失败'}));
            if(admin.status !== 1){
                return res.send({code: 403, data: '您的账号已冻结，无权访问，请联系超管。'});
            }
            next();
        }
    } else {
        next();
    }
}