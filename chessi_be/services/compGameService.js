const { userOnlineCache } = require('../cache/userOnlineCache');
const { matchMakingCache } = require('../cache/centralMatchmakingCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { activeGameCache } = require('../cache/activeGameCache');
const { activeLobby } = require('../cache/lobbyCache');
const { httpError } = require('../error/httpError');

let startCompGameService = (userid) => {
    let userFound = userOnlineCache.findUserByuserid(userid);
    
    if (!userFound) {
        throw new httpError(403, "Cannot find game. Try again later");
    }

    let isUserInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid).inLobby; // check if user in lobby

    if (isUserInLobby) { // check if user is in lobby or not, if yes, throw error
        throw (new httpError(409, "You are already in a lobby"));
    }

    let isUserInGame = activeGameCache.checkUserInGame(userid).inGame; // check if user in game

    if (isUserInGame) {
        throw (new httpError(409, "You are already in a game"));
    }

    matchMakingCache.filterUserByuserid(userid); // remove user from match making queue first

    console.log(`player ${userid} started computer game`);
}

module.exports = { startCompGameService }