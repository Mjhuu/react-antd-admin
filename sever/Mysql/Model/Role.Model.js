import Sequelize from 'sequelize'
import sequelize from './../connection'

let Role = sequelize.define('role', {
        roleName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        power: { // 权限 0-超级管理员 1-普通管理员
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }
);

export default Role
