const { Op } = require('sequelize');
const { user } = require('../models/user')
const { gameUser } = require('../models/gameUser')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')
const { ratingChange } = require('../models/ratingChange');
const { userFollow } = require('../models/userFollow');
const { post } = require('../models/post');
const { tournamentUser } = require('../models/tournamentUser');
require('dotenv').config();

let getUserDataService = async (userid, currentuserid) => {
    let userFound = await user.findOne({ where: { userid: userid } });

    if (!userFound) {
        throw (new httpError(404, "Cannot find user"));
    }

    let isCurrentUserFollowing = await userFollow.findOne({ // check whether current user is following 
        where: {
            userid: userid,
            followerid: currentuserid
        }
    })

    let _ratingChange = await ratingChange.findAll({ where: { userid: userid } });

    let gameHistoryList = await game.findAll({ // get all games user played
        include: {
            model: gameUser,
            where: { userid: userid },
        },
        order: [['gameid', 'DESC']],
        limit: 20
    });

    let tournamentHistory = await tournamentUser.findAll({ // get all tournaments user played
        where: { userid: userid },
        order: [['tournamentid', 'DESC']],
    });

    let conditions = gameHistoryList.map(Element => { // building condition array for Sequelize query
        return { gameid: Element.gameid }
    });

    let gameUserInfo = await gameUser.findAll({ // get info of games user played
        where: { [Op.or]: conditions }, 
        include: { model: user },
        order: [['gameid', 'DESC']]
    });

    // gameHistoryList.sort((a, b) => { return a.gameid - b.gameid });
    // gameUserInfo.sort((a, b) => { return a.gameid - b.gameid });

    let isFollowing = false;

    if (isCurrentUserFollowing) { 
        isFollowing = true;
    }

    let userPostList = await post.findAll({ 
        where: { authorid: userid },
        include: { model: user },
        order: [["timestamp", "DESC"]], 
        limit: 10 // get 10 latest
    });

    let normalizedRatingChange = _ratingChange.map(Element => { 
        return { rating: Element.rating, timestamp: Element.timestamp } // map to reduce return size
    }); 

    let normalizedGameHistory = new Array;

    for (let i = 0; i < gameHistoryList.length; i++) {
        normalizedGameHistory.push({ // map to reduce return size
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

    let normalizedPostList = userPostList.map(Element => {
        return { postid: Element.postid, author: Element.user.username, post: Element.post, timestamp: Element.timestamp } // map to reduce return size
    });

    return { username: userFound.username, rating: userFound.rating, ratingChange: normalizedRatingChange, gameHistory: normalizedGameHistory, posts: normalizedPostList, isFollowing: isFollowing, tournamentHistory: tournamentHistory }
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
        throw (new httpError(409, "You are not following this player"));
    }

    await isFollowing.destroy(); // delete record

    console.log(`user ${followerid} unfollowed user ${userid}`);

}

let getUserFollowingService = async (userid) => {
    let userFound = await user.findOne({ where: { userid: userid } }); // check uhether user exists

    if (!userFound) {
        throw (new httpError(404, "Cannot find user")); // if not, throw error
    }
    
    let userFollowingid = await userFollow.findAll({
        where: { followerid: userid },
        attributes: ["userid"] 
    });

    let conditions = userFollowingid.map(Element => { // building condition array for Sequelize query
        return { userid: Element.userid }
    });

    let userFollowingInfo = await user.findAll({ // get info of users user following
        where: { [Op.or]: conditions }
    });

    userFollowingInfo = userFollowingInfo.map(Element => {
        return { userid: Element.userid, username: Element.username, rating: Element.rating } // map to reduce return size
    });

    return userFollowingInfo;
}

let getLeaderboardService = async () => {

    // get 10 highest rated players
    let leaderboard = await user.findAll({
        where: { isAdmin: false },
        order: [["rating", "DESC"]],
        limit: 10
    });

    leaderboard = leaderboard.map(Element => {
        return { userid: Element.userid, username: Element.username, rating: Element.rating } // map to reduce return size
    });

    return leaderboard
}

module.exports = { getUserDataService, userFollowService, userUnfollowService, getUserFollowingService, getLeaderboardService }