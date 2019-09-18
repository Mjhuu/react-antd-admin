import Model from "./../main";
import Sequelize from 'sequelize'
import Jwt from "../../jwt";
const Op = Sequelize.Op;
import {getAdminId} from "../../allRequest";
import {toNumber} from "../../Decorator";

class MessageController {
    // 批量标记已读消息
    @toNumber({
        type: 'post',
        dealValue: ['chatRoomId']
    })
    async flagReadMoreMsg(req, res, next){
        let {chatRoomId} = req.body;
        let adminId = await getAdminId(req, res, next);
        let isReadMsgIds = await Model.ReadMessage.findAll({
            where:{
                adminId, chatRoomId
            }
        });
        let isReadMsgIdList = [];
        isReadMsgIds.forEach(readMsg =>{
           isReadMsgIdList.push(readMsg.messageId)
        });
        let allMs = await Model.Message.findAll({
           where: {
               id: {
                   [Op.notIn]: isReadMsgIdList
               },
               chatRoomId
           }
        });
        let newReadMsgList = [];
        allMs.forEach(msg =>{
            newReadMsgList.push({
                adminId, chatRoomId, messageId: msg.id
            })
        });
        let bulkReadMsg = await Model.ReadMessage.bulkCreate(newReadMsgList);
        res.json({
            code: 200,
            data: '此聊天室所有消息已标记已读'
        })
    }
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
    @toNumber({
        type: 'post',
        dealValue: ['chatRoomId']
    })
    async addChat(req, res, next){
        let {msg, chatRoomId} = req.body;
        let adminId = await getAdminId(req, res, next);
        let newChat = await Model.Message.build({
            msg, adminId, createTime: new Date(), chatRoomId
        });
        newChat = await newChat.save();
        //将自己的消息标记已读
        let readMsg = await Model.ReadMessage.create({
           adminId, chatRoomId, messageId: newChat.id
        });
        res.json({
           code: 200,
           data: '消息发送成功'
        });
    }
}

export default new MessageController()
