import Sequelize from 'sequelize'
import sequelize from './../connection'

let Admin = sequelize.define('admin', {
        username: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        uuid: {
            type: Sequelize.STRING(40),
            allowNull: false,
            unique: true
        },
        // 账号状态 1-正常 2-冻结或违规 3-删除
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        headImg: {
            type: Sequelize.TEXT,
        },
        signContent: {
            type: Sequelize.TEXT,
        },
        gender: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        phone: {
            type: Sequelize.CHAR(11),
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING(80),
            allowNull: false
        },
        loginTime: {
            type: Sequelize.DATE,
        },
        ipAddress: {
            type: Sequelize.TEXT,
        },
        backgroundImg: {
            type: Sequelize.TEXT,
        }
    }
);

export default Admin
