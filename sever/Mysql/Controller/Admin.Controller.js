import Model from "./../main";
import sequelize from 'sequelize'
import {toNumber, superAdmin} from "../../Decorator";
import md5 from 'blueimp-md5'
import Jwt from "../../jwt";
import uuid from 'uuid'
import {getIpAndAddress} from "../../allRequest";

class AdminController {
    /*重新设置token*/
    updateToken(req, res, next){
        let oldToken = req.headers.token;
        let jwt1 = new Jwt(oldToken);
        let result = jwt1.verifyToken();
        let uuid = result.adminId;
        let jwt2 = new Jwt({
            adminId: uuid
        });
        let token = jwt2.generateToken();
        res.json({
            code: 200, token, data: 'token更新成功'
        })
    }
    /*管理员登录*/
    async adminLogin(req, res, next) {
        let {username, password} = req.body;
        password = md5(password);
        let admin = await Model.Admin.findOne({where: {username, password}}).catch(err => next({
            res: err,
            msg: '查询登录数据失败'
        }));
        if (!admin) {
            return res.json({code: 500, data: '用户名或密码错误！'})
        }
        if(admin.status !== 1){
            return res.json({code: 500, data: '账号已被冻结！'})
        }
        let ipAddress = await getIpAndAddress(req);
        //正确则登录 并修改登录时间
        admin.loginTime = new Date();
        admin.ipAddress = JSON.stringify(ipAddress);
        await admin.save().catch(err => next({res: err, msg: '信息保存失败'}));
        admin = await Model.Admin.findOne({
            where: {id: admin.id},
            attributes: {exclude: ['password', 'id']}
        }).catch(err => next({res: err, msg: '查询登录数据失败'}));
        let roleInfo = await Model.Role.findOne({
            where: {
                id: admin.roleId
            },
            attributes: ['roleName', 'power']
        });
        let jwt = new Jwt({
            adminId: admin.uuid
        });
        let token = jwt.generateToken();
        res.json({
            code: 200, result: {
                admin, roleInfo
            }, token, data: '登录成功'
        })
    }
    /* 删除管理员 --- 只有超管才可以调用 */
    @superAdmin
    async delAdmin(req, res, next){
        res.json({
            code: 200,
            data: '删除成功'
        })
    }
    /* 冻结管理员 --- 只有超管才可以调用 */
    @superAdmin
    async freezeAdmin(req, res, next){
        res.json({
            code: 200,
            data: '冻结成功'
        })
    }
    /* 管理员添加 --- 只有超管才可以调用 */
    @toNumber({
        type: 'post',
        dealValue: ['phone', 'roleId']
    })
    async addAdmin(req, res, next) {
        let {username, phone, password = 'admin666', roleId} = req.body;
        console.log(phone);
        let newAdmin = await Model.Admin.create({
            username, phone, password: md5(password), roleId, uuid: uuid.v1().replace(/\-/g, '')
        }).catch(err => next({msg: '管理员添加失败', res: err}));
        res.json({
            code: 200,
            data: '管理员添加成功'
        })
    }
    /*获取管理员信息*/
    async getAdminInfo(req, res, next){
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let uuid = result.adminId;
        let admin = await Model.Admin.findOne({
            where: {
                uuid
            },
            attributes: {exclude: ['password', 'id']}
        }).catch(err => next({res: err, msg: '获取管理员信息失败'}));
        if(!admin){
            return next({msg: '暂无此管理员'})
        }
        let roleInfo = await Model.Role.findOne({
            where: {
                id: admin.roleId
            },
            attributes: ['roleName', 'power']
        });
        res.json({
            code: 200,
            result: {admin, roleInfo},
            data: '获取管理员信息成功'
        })
    }
    /*获取所有管理员列表*/
    async getAllAdminList(req, res, next){
        let adminList = [];
        let admins = await Model.Admin.findAndCountAll({
            attributes: {exclude: ['password', 'id']}
        }).catch(err => next({msg: '管理员查询失败', res: err}));
        for (let i = 0; i < admins.rows.length; i++) {
            let roleInfo = await Model.Role.findOne({
                where: {
                    id: admins.rows[i].roleId
                },
                attributes: ['roleName', 'power']
            });
            adminList.push({
                adminInfo: admins.rows[i],
                roleInfo
            })
        }
        res.json({
            code: 200,
            data: '获取所有管理员列表成功',
            result: {
                count: admins.count,
                adminList
            }
        })
    }
    /*获取管理员列表*/
    @toNumber({
        type: 'get',
        dealValue: ['page', 'limit']
    })
    async getAdminList(req, res, next) {
        let {page, limit} = req.query;
        page = page > 0 ? parseInt(page) : 1;
        let offset = page * limit - limit;
        let adminList = [];
        let admins = await Model.Admin.findAndCountAll({
            limit, offset, attributes: {exclude: ['password', 'id']}
        }).catch(err => next({msg: '管理员查询失败', res: err}));
        for (let i = 0; i < admins.rows.length; i++) {
            let roleInfo = await Model.Role.findOne({
                where: {
                    id: admins.rows[i].roleId
                },
                attributes: ['roleName', 'power']
            });
            adminList.push({
                adminInfo: admins.rows[i],
                roleInfo
            })
        }
        res.json({
            code: 200,
            data: '获取管理员列表成功',
            result: {
                count: admins.count,
                adminList
            }
        })
    }
}

export default new AdminController()
