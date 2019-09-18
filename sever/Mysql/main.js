import sequelize from './connection'

/*引入所有表模型*/
//管理员表
import Admin from './Model/Admin.Model'
//角色表
import Role from './Model/Role.Model'
//消息表
import Message from './Model/Message.Model'
//部门表
import Department from './Model/Department.Model'
//职位表
import Job from './Model/Job.Model'
//加入的聊天室表
import AdminChatRoom from './Model/AdminChatRoom.Model'
//分享文章、软件表
import Article from './Model/Article.Model'
//聊天室表
import ChatRoom from './Model/ChatRoom.Model'
//消息已读表
import ReadMessage from './Model/ReadMessage.Model'
//收藏表
import Collect from './Model/Collect.Model'
//评论表
import Comment from './Model/Comment.Model'
//评分表
import Grade from './Model/Grade.Model'
//邀请加入表
import InviteJoinChat from './Model/InviteJoinChat.Model'
//作品表
import Project from './Model/Project.Model'
//提议表
import Suggest from './Model/Suggest.Model'

/*初始化联系*/
// 部门人员<属于>角色 m:1
Role.hasMany(Admin);
Admin.belongsTo(Role);
// 部门人员<加入>职位 m:1
Job.hasMany(Admin);
Admin.belongsTo(Job);
// 部门<创建>职位 1:n
let Jobs = Department.hasMany(Job);
Job.belongsTo(Department);
// 部门人员<创建>聊天室 1:n
Admin.hasMany(ChatRoom);
ChatRoom.belongsTo(Admin);
// 部门人员<邀请>聊天室 m:n
Admin.belongsToMany(ChatRoom, {through: InviteJoinChat});
ChatRoom.belongsToMany(Admin, {through: InviteJoinChat});
// 部门人员<加入>聊天室 m:n
Admin.belongsToMany(ChatRoom, {through: AdminChatRoom});
ChatRoom.belongsToMany(Admin, {through: AdminChatRoom});
//  部门人员<已读>消息 m:n
Admin.belongsToMany(Message, {through: ReadMessage});
Message.belongsToMany(Admin, {through: ReadMessage});
// 部门人员<发布>作品 1:n
Admin.hasMany(Project);
Project.belongsTo(Admin);
// 部门人员<发起>提议 1:n
Admin.hasMany(Suggest);
Suggest.belongsTo(Admin);
// 部门人员<发布>文章、软件 1:n
Admin.hasMany(Article);
Article.belongsTo(Admin);
// 部门人员<评论>文章、软件 m:n
Admin.belongsToMany(Article, {through: Comment});
Article.belongsToMany(Admin, {through: Comment});
// 部门人员<收藏>文章、软件 m:n
Admin.belongsToMany(Article, {through: Collect});
Article.belongsToMany(Admin, {through: Collect});
// 部门人员<评分>文章、软件 m:n
Admin.belongsToMany(Article, {through: Grade});
Article.belongsToMany(Admin, {through: Grade});
// 聊天室<发送>消息 1:n
ChatRoom.hasMany(Message);
Message.belongsTo(ChatRoom);

/*强制重构表*/
// sequelize.sync({force: true}).then(d=> {
//     console.log('所有表初始化完成，所有表已重构。');
// });
/*同步最新的模型到数据库*/
// sequelize.sync({alter: true}).then(d=> {
//     console.log('同步所有表最新的模型到数据库，数据保留。');
// });
/*对外输出*/
export default {
    Admin,
    Role,
    Message,
    Department,
    AdminChatRoom,
    Article,
    ChatRoom,
    Collect,
    Comment,
    Grade,
    InviteJoinChat,
    Project,
    Job,
    Jobs,
    Suggest,
    ReadMessage
}
