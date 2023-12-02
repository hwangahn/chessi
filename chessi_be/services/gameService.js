const { activeGameCache } = require('../cache/activeGameCache');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { userOnlineCache } = require('../cache/userOnlineCache');
const { httpError } = require('../error/httpError');

let findGameService = async ( userid ) => {
    let userFound = userOnlineCache.findUserByuserid(userid);
    
    if (!userFound) {
        throw new httpError(500, "Cannot find game. Try again later");
    }

    console.log(`user ${userid} finding match`);
    
    matchMakingCache.addUser(userFound); // add user to match making queue
}

let stopFindGameService = async ( userid ) => {
    matchMakingCache.filterUserByuserid(userid); // remove user from match making queue

    console.log(`user ${userid} stop finding match`);
}

let getGameService = async (gameid) => {
    let gameFound = activeGameCache.findGameBygameid(gameid);

    if (!gameFound) {
        throw new httpError(404, "Cannot find game");
    }

    return gameFound.getGameInfo();
}

let getUserActiveGameService = async (userid) => {
    let isUserInGame = activeGameCache.checkUserInGame(userid);

    return isUserInGame;
}

module.exports = { findGameService, stopFindGameService, getGameService, getUserActiveGameService }