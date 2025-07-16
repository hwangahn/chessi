const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let tournamentGame = connection.define('tournamentGame', {
    tournamentid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    gameid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    whiteid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    blackid: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    whiteUsername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blackUsername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whiteRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blackRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    winner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    outcome: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "tournamentgame",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { tournamentGame };
