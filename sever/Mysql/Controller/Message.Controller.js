import Model from "./../main";
import sequelize from 'sequelize'
import Jwt from "../../jwt";

class MessageController {
    // 获取全部聊天记录
    async getAllMessages(req, res, next) {
        let messageList = [];
        let data = await Model.Message.findAll().catch(err => next({msg: '消息列表查询失败', res: err}));
        for (let i = 0; i < data.length; i++) {
            let roleInfo;
            let adminInfo = await Model.Admin.findOne({
                where: {id: data[i].adminId},
                attributes: ['uuid', 'username', 'roleId', 'headImg']
            }).catch(err => next({msg: '查询发布消息的管理员失败', res: err}));
            if (adminInfo.roleId) {
                roleInfo = await Model.Role.findOne({
                    where: {id: adminInfo.roleId},
                    attributes: ['roleName', 'power']
                });
            }
            messageList.push({adminInfo: {adminInfo, roleInfo}, msgInfo: data[i]})
        }
        res.json({
            code: 200,
            data: '聊天消息获取成功',
            result: messageList
        })
    }
    // 添加新增聊天记录
    async addChat(req, res, next){
        let {msg} = req.body;
        let token = req.headers.token;
        let jwt = new Jwt(token);
        let result = jwt.verifyToken();
        let uuid = result.adminId;
        let admin = await Model.Admin.findOne({
            where: {uuid}
        }).catch(err => next({res: err, msg: '获取管理员信息失败'}));
        let newChat = await Model.Message.build({
            msg, adminId: admin.id, createTime: new Date()
        });
        let data = await newChat.save();
        res.json({
           code: 200,
           data: '消息发送成功'
        });
    }
}

export default new MessageController()
