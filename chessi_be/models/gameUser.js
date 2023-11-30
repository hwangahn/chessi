const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let gameUser = connection.define('gameUser', {
    gameid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    side: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    ratingChange: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "gameUser",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { gameUser };