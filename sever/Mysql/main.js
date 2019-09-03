import sequelize from './connection'

/*引入所有表模型*/
//管理员表
import Admin from './Model/Admin.Model'
//角色表
import Role from './Model/Role.Model'
//消息表
import Message from './Model/Message.Model'

/*初始化联系*/
// 管理员和角色 m:1
Role.hasMany(Admin);
Admin.belongsTo(Role);
// 管理员和聊天消息 1:n
Admin.hasMany(Message);
Message.belongsTo(Admin);

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
    Admin,Role,Message
}
