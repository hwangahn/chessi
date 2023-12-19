const { Op } = require('sequelize');
const { user } = require('../models/user')
const { gameUser } = require('../models/gameUser')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')
const { ratingChange } = require('../models/ratingChange')
require('dotenv').config();

let getUserDataService = async (userid) => {
    let userFound = await user.findOne({ where: { userid: userid } });

    if (!userFound) {
        throw (new httpError(404, "Cannot find user"));
    }

    let _ratingChange = await ratingChange.findAll({ where: { userid: userid } });

    let gameHistoryList = await game.findAll({
        include: {
            model: gameUser,
            where: { userid: userid }
        },
        order: [['gameid', 'DESC']]
    });

    let conditions = gameHistoryList.map(Element => {
        return { gameid: Element.gameid }
    });

    let gameUserInfo = await gameUser.findAll({
        where: {
            [Op.or]: conditions
        }, 
        include: {
            model: user
        },
        order: [['gameid', 'DESC']]
    });

    // gameHistoryList.sort((a, b) => { return a.gameid - b.gameid });
    // gameUserInfo.sort((a, b) => { return a.gameid - b.gameid });

    let normalizedRatingChange = _ratingChange.map(Element => { 
        return { rating: Element.rating, timestamp: Element.timestamp } 
    }); 

    let normalizedGameHistory = new Array;

    for (let i = 0; i < gameHistoryList.length; i++) {
        normalizedGameHistory.push({
            gameid: gameHistoryList[i].gameid,
            reason: gameHistoryList[i].reason,
            timestamp: gameHistoryList[i].timestamp,
            finalFen: gameHistoryList[i].finalFen,
            white: gameUserInfo[i * 2].side === "white" ? gameUserInfo[i * 2].user.username : gameUserInfo[i * 2 + 1].user.username,
            black: gameUserInfo[i * 2].side === "black" ? gameUserInfo[i * 2].user.username : gameUserInfo[i * 2 + 1].user.username,
            whiteRatingChange: gameUserInfo[i * 2].side === "white" ? gameUserInfo[i * 2].ratingChange : gameUserInfo[i * 2 + 1].ratingChange,
            blackRatingChange: gameUserInfo[i * 2].side === "black" ? gameUserInfo[i * 2].ratingChange : gameUserInfo[i * 2 + 1].ratingChange
        });
    }

    return { username: userFound.username, rating: userFound.rating, ratingChange: normalizedRatingChange, gameHistory: normalizedGameHistory }
}

module.exports = { getUserDataService }