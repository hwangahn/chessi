const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let userFollow = connection.define('userFollow', {
    followerid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    }
}, {
    tableName: "userFollow",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { userFollow };