const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let ratingChange = connection.define('ratingChange', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "ratingChange",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { ratingChange };