const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let tournamentUser = connection.define('tournamentUser', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    tournamentid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: { // tournament name
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "tournamentuser",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { tournamentUser };
