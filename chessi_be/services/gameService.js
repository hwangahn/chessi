const { activeGameCache } = require('../cache/activeGameCache');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { userOnlineCache } = require('../cache/userOnlineCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { httpError } = require('../error/httpError');

let findGameService = async ( userid ) => {
    let userFound = userOnlineCache.findUserByuserid(userid);
    
    if (!userFound) {
        throw new httpError(403, "Cannot find game. Try again later");
    }

    let isUserInGame = activeGameCache.checkUserInGame(userid).inGame; // check if user in game

    if (isUserInGame) {
        throw (new httpError(409, "You are already in a game"));
    }

    let isUserInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid).inLobby; // check if user in lobby

    if (isUserInLobby) {
        throw (new httpError(409, "You are already in a lobby"));
    }

    matchMakingCache.addUser(userFound); // add user to match making queue
    
    console.log(`user ${userid} finding match`);
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