const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let email = connection.define('email', {
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verificationToken: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
    verificationStatus: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: "email",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { email };