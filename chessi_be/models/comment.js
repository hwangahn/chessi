const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let comment = connection.define('comment', {
    commentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    postid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "comment",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { comment };