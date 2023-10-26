const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let move = connection.define('move', {
    gameid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }, 
    side: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    moveOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    notation: {
        type: DataTypes.INTEGER, 
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