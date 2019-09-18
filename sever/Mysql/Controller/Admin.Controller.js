import Model from "./../main";
import Sequelize from 'sequelize'
import {toNumber, superAdmin} from "../../Decorator";
import md5 from 'blueimp-md5'
import Jwt from "../../jwt";
import uuid from 'uuid'
import {getAdminId, getIpAndAddress} from "../../allRequest";
import formidable from "formidable";
import config from "../../config";
const Op = Sequelize.Op;

async function formatAdminList(admins) {
    let adminList = [];
    for (let i = 0; i < admins.rows.length; i++) {
        let roleInfo = await Model.Role.findOne({
            where: {
                id: admins.rows[i].roleId
            },
            attributes: ['roleName', 'power', 'rolePower']
        });
        let jobInfo = await Model.Job.findOne({
            where: {
                id: admins.rows[i].jobId
            },
            attributes: ['jobName', 'departmentId', 'id']
        });
        let departmentInfo = await Model.Department.findOne({
            where: {
                id: jobInfo.departmentId
            }
        });
        adminList.push({
            adminInfo: admins.rows[i],
            roleInfo,
            jobInfo, departmentInfo
        })
    }
    return adminList
}

class AdminController {
    /*修改基本信息*/
    async reviseInfo(req, res, next){
        let {adminInfo} = req.body;
        let adminId = await getAdminId(req, res, next);
        let admin = await Model.Admin.findByPk(adminId);
        if(Object.prototype.toString.call(adminInfo) !== '[object Object]'){
            return res.json({code: 500, data: '需传递Object格式的adminInfo'})
        }
        let errorState = false;
        let errorContent = '';
        for(let key in adminInfo){
            if(adminInfo.hasOwnProperty(key)){
                if(key === 'phone'){
                    // 判断手机号是否存在
                    let hasPhone = await Model.Admin.findOne({where:{phone: adminInfo[key], id: {[Op.ne]: adminId}}});
                    if(!!hasPhone){
                        errorState = true;
                        errorContent = '手机号已存在';
                        break
                    }
                }
                if(key === 'username'){
                    // 判断用户名是否存在
                    let hasUsername = await Model.Admin.findOne({where:{username: adminInfo[key], id: {[Op.ne]: adminId}}});
                    if(!!hasUsername){
                        errorState = true;
                        errorContent = '用户名已存在';
                        break
                    }
                }
                if(key === 'password'){
                    //判断原始密码是否准确
                    if(md5(adminInfo['oldPassword']) !== admin.password){
                        errorState = true;
                        errorContent = '原始密码输入错误';
                        break
                    }
                    admin[key] = md5(adminInfo[key]);
                    continue
                }
                if(key !== 'oldPassword'){
                    admin[key] = adminInfo[key]
                }
            }
        }
        if(errorState){
            return res.json({
                code: 500,
                data: errorContent
            })
        }
        admin.save().catch(err => next({res: err, msg: '信息修改失败'}));
        res.json({
            code: 200,
            data: '信息修改成功',
            result: admin
        })
    }
    /*修改头像或背景图片*/
    async reviseImg(req, res, next){
        let adminId = await getAdminId(req, res, next);
        let form = new formidable.IncomingForm();
        form.uploadDir = config.uploadImgDir;
        form.keepExtensions = true;
        form.parse(req, async function(err, fields, files) {
            if(err) throw err;
            let {type} = fields;
            let path = files['img'].path;
            let imgSrc = `http://localhost:3000/uploadImg/${path.slice(path.lastIndexOf('\\')+1)}`;
            let admin = await Model.Admin.findByPk(adminId);
            admin[type] = imgSrc;
            admin.save().catch(err => next({res: err, msg: '图片保存失败'}));
            res.json({
                code: 200,
                data: '修改成功',
                result: imgSrc
            })
        });
    }
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
    /*技术人员登录*/
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
        let jobInfo = await Model.Job.findOne({
            where: {
                id: admin.jobId
            },
            attributes: ['jobName', 'departmentId', 'id']
        });
        let departmentInfo = await Model.Department.findOne({
            where: {
                id: jobInfo.departmentId
            }
        });
        let jwt = new Jwt({
            adminId: admin.uuid
        });
        let token = jwt.generateToken();
        res.json({
            code: 200, result: {
                admin, roleInfo, jobInfo, departmentInfo
            }, token, data: '登录成功'
        })
    }
    /* 更换岗位 --- 只有超管才可以调用 */
    @superAdmin
    @toNumber({
        type: 'post',
        dealValue: ['jobId', 'type', 'roleId']
    })
    async updateJob(req, res, next){
        let {uuid, jobId, type = 1, roleId} = req.body;
        let admin = await Model.Admin.findOne({
            where: {uuid}
        });
        if(!admin){
            return next({msg: '很抱歉，未找到此技术人员'})
        }
        if(type === 1){
            admin.jobId = jobId;
        }else if(type === 2){
            admin.roleId = roleId;
        }
        await admin.save().catch(err => next({res: err, msg: type === 1 ? '岗位更换失败' : '职称更换失败'}));
        res.json({
            code: 200,
            data: type === 1 ? '岗位更换成功' : '职称更换成功'
        })
    }
    /* 冻结技术人员 --- 只有超管才可以调用 */
    @superAdmin
    @toNumber({
        type: 'post',
        dealValue: ['status']
    })
    async freezeAdmin(req, res, next){
        let {uuid, status} = req.body;
        let admin = await Model.Admin.findOne({
            where: {uuid}
        });
        if(!admin){
            return next({msg: '很抱歉，未找到此技术人员'})
        }
        admin.status = status;
        await admin.save().catch(err => next({res: err, msg: status === 1 ? '解封失败' : status === 2 ? '冻结失败' : '删除失败'}));
        res.json({
            code: 200,
            data: status === 1 ? '账号已解封' : status === 2 ? '冻结成功' : '删除成功'
        })
    }
    /* 技术人员添加 --- 只有超管才可以调用 */
    @toNumber({
        type: 'post',
        dealValue: ['phone', 'roleId', 'jobId']
    })
    async addAdmin(req, res, next) {
        let {username, phone, password = 'admin666', roleId, jobId} = req.body;
        // 先判断用户名是否存在
        let isUsername = await Model.Admin.findOne({where: {username}});
        if(isUsername){
            return res.json({
                code: 500,
                data: '用户名重复'
            })
        }
        let isPhone = await Model.Admin.findOne({where: {phone}});
        if(isPhone){
            return res.json({
                code: 500,
                data: '手机号重复'
            })
        }
        // 判断手机号是否存在
        let newAdmin = await Model.Admin.create({
            username, phone, password: md5(password), roleId, uuid: uuid.v1().replace(/\-/g, ''), jobId
        }).catch(err => next({msg: '技术人员添加失败', res: err}));
        //将此技术人员自动添加至技术总群
        let addToRoom = await Model.AdminChatRoom.create({
            adminId: newAdmin.id,
            chatRoomId: 5
        }).catch(err => next({msg: '加入技术总群失败', res: err}));
        res.json({
            code: 200,
            data: '技术人员添加成功'
        })
    }
    /*获取技术人员信息*/
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
        }).catch(err => next({res: err, msg: '获取技术人员信息失败'}));
        if(!admin){
            return next({msg: '暂无此技术人员'})
        }
        let roleInfo = await Model.Role.findOne({
            where: {
                id: admin.roleId
            },
            attributes: ['roleName', 'power', 'rolePower']
        });
        let jobInfo = await Model.Job.findOne({
            where: {
                id: admin.jobId
            },
            attributes: ['jobName', 'departmentId', 'id']
        });
        let departmentInfo = await Model.Department.findOne({
            where: {
                id: jobInfo.departmentId
            }
        });
        res.json({
            code: 200,
            result: {admin, roleInfo, jobInfo, departmentInfo},
            data: '获取技术人员信息成功'
        })
    }
    /*获取所在聊天室的所有技术人员列表*/
    @toNumber({
        type: 'get',
        dealValue: ['chatRoomId']
    })
    async getAllAdminList(req, res, next){
        let {chatRoomId} = req.query;
        let joinAdmins = await Model.AdminChatRoom.findAll({
            where: {chatRoomId}
        });
        let joinAdminsId = [];
        let adminTypeList = {};
        joinAdmins.forEach(joinAdmin=>{
            joinAdminsId.push(joinAdmin.adminId);
            adminTypeList[joinAdmin.adminId] = joinAdmin.adminType;
        });
        let admins = await Model.Admin.findAndCountAll({
            where: {
                id: joinAdminsId,
                status: {
                    [Op.ne]: 3
                },
            },
            attributes: {exclude: ['password']}
        }).catch(err => next({msg: '技术人员查询失败', res: err}));
        let adminList = await formatAdminList(admins);
        adminList.forEach(admin =>{
           admin.adminType = adminTypeList[admin.adminInfo.id]
        });
        res.json({
            code: 200,
            data: '获取所有技术人员列表成功',
            result: {
                count: admins.count,
                adminList
            }
        })
    }
    /*获取技术人员列表*/
    @toNumber({
        type: 'get',
        dealValue: ['page', 'limit', 'departmentId', 'jobId', 'roleId', 'gender', 'status']
    })
    async getAdminList(req, res, next) {
        let {page, limit, departmentId, jobId, roleId, gender, status} = req.query;
        let dealObj = {departmentId, jobId, roleId, gender, status};
        /*根据传来有参数的条件进行筛选处理*/
        let obj = {};
        for(let key in dealObj){
            if(dealObj[key] !== 'undefined'){
                if(key === 'jobId'){
                    obj[key] = {
                        [Op.in]: [dealObj[key]]
                    };
                    continue
                }
                obj[key] = dealObj[key]
            }
        }
        let jobIdArr = [];
        if(dealObj['departmentId'] !== 'undefined' && dealObj['jobId'] === 'undefined'){
            let jobs = await Model.Job.findAll({
                where: {
                    departmentId
                }
            });
            for (const job of jobs) {
                jobIdArr.push(job.id)
            }
            obj['jobId'] = {
                [Op.in]: jobIdArr
            };
        }
        delete obj['departmentId'];

        page = page > 0 ? parseInt(page) : 1;
        let offset = page * limit - limit;
        let admins = await Model.Admin.findAndCountAll({
            where: {
                status: {
                    [Op.ne]: 3
                },
                ...obj
            },
            limit, offset, attributes: {exclude: ['password', 'id']}
        }).catch(err => next({msg: '技术人员查询失败', res: err}));
        let adminList = await formatAdminList(admins);
        res.json({
            code: 200,
            data: '获取技术人员列表成功',
            result: {
                count: admins.count,
                adminList
            }
        })
    }
}

export default new AdminController()
