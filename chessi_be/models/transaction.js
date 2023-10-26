const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let transaction = connection.define('transaction', {
    transactionid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    }, 
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "transaction",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { transaction };