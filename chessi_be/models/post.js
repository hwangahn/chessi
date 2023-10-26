const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let post = connection.define('post', {
    postid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    authorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "post",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { post };