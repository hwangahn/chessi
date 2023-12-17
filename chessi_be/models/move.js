const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let move = connection.define('move', {
    gameid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }, 
    moveOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    side: {
        type: DataTypes.STRING,
    },
    notation: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    fen: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "move",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { move };