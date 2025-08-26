const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let studyChapter = connection.define('studyChapter', {
    chapterid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    authorid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    studyid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    annotations: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
    },
    moves: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: true
    },
    internalOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 10000,
        allowNull: false
    }
}, {
    tableName: "studychapter",
    timestamps: true,
    createdAt: "timestamp",
    updatedAt: false
});

module.exports = { studyChapter };
