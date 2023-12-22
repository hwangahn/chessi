const { Op } = require('sequelize');
const { user } = require('../models/user')
const { gameUser } = require('../models/gameUser')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')
const { ratingChange } = require('../models/ratingChange');
const { userFollow } = require('../models/userFollow');
require('dotenv').config();

let getUserDataService = async (userid) => {
    let userFound = await user.findOne({ where: { userid: userid } });

    if (!userFound) {
        throw (new httpError(404, "Cannot find user"));
    }

    let _ratingChange = await ratingChange.findAll({ where: { userid: userid } });

    let gameHistoryList = await game.findAll({ // get all games user played
        include: {
            model: gameUser,
            where: { userid: userid }
        },
        order: [['gameid', 'DESC']]
    });

    let conditions = gameHistoryList.map(Element => { // building condition array for Sequelize query
        return { gameid: Element.gameid }
    });

    let gameUserInfo = await gameUser.findAll({ // get info of games user played
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

let userFollowService = async (followerid, userid) => { // userid indicates user to follow 
    let userFound = await user.findOne({ where: { userid: userid } }); // check uhether user exists

    if (!userFound) {
        throw (new httpError(404, "Cannot find user")); // if not, throw error
    }

    if (followerid == userid) { // check if user is requesting to follow themself
        throw (new httpError(403, "You cannot follow yourself")); // throw error
    }

    let isFollowing = await userFollow.findOne({ // check if user is already following  
        where: {
            followerid: followerid, 
            userid: userid,
        }
    });

    if (isFollowing) {
        throw (new httpError(409, "You are already following this player")); // throw error
    }

    await userFollow.create({
        userid: userid,
        followerid: followerid
    });
    
    console.log(`user ${followerid} followed user ${userid}`);
}

let userUnfollowService = async (followerid, userid) => {
    let userFound = await user.findOne({ where: { userid: userid } }); // check uhether user exists

    if (!userFound) {
        throw (new httpError(404, "Cannot find user")); // if not, throw error
    }

    if (followerid == userid) { // check if user is requesting to follow themself
        throw (new httpError(403, "You cannot unfollow yourself")); // throw error
    }

    let isFollowing = await userFollow.findOne({ // check if user is following  
        where: {
            followerid: followerid, 
            userid: userid,
        }
    });

    if (!isFollowing) {
        throw (new httpError(409, "You are not following this player")); // throw error
    }

    await isFollowing.destroy();

    console.log(`user ${followerid} unfollowed user ${userid}`);

}

module.exports = { getUserDataService, userFollowService, userUnfollowService }