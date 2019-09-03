import Sequelize from 'sequelize'
import sequelize from './../connection'

let Message = sequelize.define('message', {
        msg: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        createTime: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }
);

export default Message
