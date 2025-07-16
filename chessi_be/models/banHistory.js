const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let banHistory = connection.define('banHistory', {
    banid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    until: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: "banhistory",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { banHistory };