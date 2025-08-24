const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let study = connection.define('study', {
    studyid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    authorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.JSON,
        allowNull: true
    },
    editors: {
        type: DataTypes.JSON,
        allowNull: true
    },
    emoji: {
        type: DataTypes.STRING,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "study",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { study };
