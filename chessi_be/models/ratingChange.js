const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let ratingChange = connection.define('ratingChange', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: "ratingChange",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { ratingChange };