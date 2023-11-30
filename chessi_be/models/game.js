const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let game = connection.define('game', {
    gameid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    }, 
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pgn: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    finalFen: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "game",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { game };