const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let user = connection.define('user', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }, 
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "user",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { user };