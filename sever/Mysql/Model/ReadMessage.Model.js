import Sequelize from 'sequelize'
import sequelize from './../connection'

let ReadMessage = sequelize.define('readMessage', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatRoomId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

export default ReadMessage
