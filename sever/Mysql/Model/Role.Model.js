import Sequelize from 'sequelize'
import sequelize from './../connection'

let Role = sequelize.define('role', {
        roleName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        rolePower: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        power: { // 权限 0-P10 P9 1-P8 P7 2-P6 P5 3-P4 P3 4-P2 P1
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 4
        }
    }
);

export default Role
