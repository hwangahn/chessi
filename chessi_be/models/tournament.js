const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let tournament = connection.define('tournament', {
    tournamentid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    organizerid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 300 // 5 minutes in seconds
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "tournament",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { tournament };
