import {isToNumber} from "../util";
import Jwt from "../jwt";
import Model from "../Mysql/main";

/**
 * 将数字字符串变成数字number
 * @param type
 * @param dealValue
 * @returns {function(*, *, *): *}
 */
export function toNumber({type, dealValue}) {
    return function (target, key, descriptor) {
        let oldMethods = descriptor.value;
        descriptor.value = function (req, res, next) {
            let kind = type.toLowerCase() === 'post' ? 'body' : type.toLowerCase() === 'get' ? 'query' : undefined;
            if(kind === undefined){
                return res.json({
                    code: 500,
                    data: '处理的type值只能是post或get'
                })
            }
            dealValue.forEach(value => {
                if(isToNumber(req[kind][value])){
                    req[kind][value] = Number(req[kind][value])
                }else {
                    throw new Error(`${value}为"${typeof req[kind][value]}"类型，不能转成数字`)
                }
            });
            return oldMethods.apply(this, arguments)
        };
        return descriptor
    }
}

export function superAdmin (target, key, descriptor) {
    let oldMethods = descriptor.value;
    descriptor.value = async function (req, res, next) {
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let uuid = result.adminId;
        // 查询管理员信息
        let admin = await Model.Admin.findOne({where: {uuid}}).catch(err => next({res: err, msg: '获取管理员信息失败'}));
        let roleInfo = await Model.Role.findByPk(admin.roleId);
        if(roleInfo.power !== 0){
            return res.send({code: 500, data: '只有超管才能操作！'});
        }
        return oldMethods.apply(this, arguments)
    };
    return descriptor
}

