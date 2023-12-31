const { userOnlineCache } = require('../cache/userOnlineCache');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { activeGameCache } = require('../cache/activeGameCache');
const { activeLobby } = require('../cache/lobbyCache');
const { httpError } = require('../error/httpError');


let createLobbyService = (userid) => {
    let isUserInGame = activeGameCache.checkUserInGame(userid).inGame; // check if user in game

    if (isUserInGame) {
        throw (new httpError(409, "You are already in a game"));
    }

    let isUserInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid).inLobby; // check if user in lobby

    if (isUserInLobby) {
        throw (new httpError(409, "You are already in a lobby"));
    }

    matchMakingCache.filterUserByuserid(userid); // remove user from matchmaking cache

    let userFound = userOnlineCache.findUserByuserid(userid);

    if (!userFound) {
        throw (new httpError(403, "Cannot create lobby"))
    }

    let lobbyid = `l_${Date.now()}`;

    activeLobbyCache.addLobby(new activeLobby(lobbyid, userFound)); // add new lobby to cache

    console.log(`user ${userid} created lobby ${lobbyid}`);

    return { lobbyid };
}

let joinLobbyService = (userid, _lobbyid) => {
    let userFound = userOnlineCache.findUserByuserid(userid);

    if (!userFound) {
        throw (new httpError(403, "Cannot join lobby"));
    }

    let isUserInGame = activeGameCache.checkUserInGame(userid).inGame; // check if user in game

    if (isUserInGame) {
        throw (new httpError(409, "You are already in a game"));
    }

    let { inLobby, lobbyid } = activeLobbyCache.checkUserInLobbyByuserid(userid); // check if user in lobby

    if (inLobby && _lobbyid !== lobbyid) { // check whether user is in lobby with a different id
        throw (new httpError(409, "You are already in a lobby")); 
    } 

    matchMakingCache.filterUserByuserid(userid); // remove user from matchmaking cache

    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(_lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    // check whether user is in a lobby 
    // if is, check whether the lobby has the same id or not
    if (!inLobby || _lobbyid !== lobbyid) {
        // if not, join lobby
        let isAddedToLobby = lobbyFound.addUser(userFound); // try adding player to lobby
    
        if (!isAddedToLobby) {
            throw (new httpError(403, "Lobby full"));
        }
    }

    let { creator, guest, white, black, timeLeft } = lobbyFound.getState(); // get lobby state and info

    console.log(`user ${userid} joined lobby ${_lobbyid}`);
    
    return { creator: creator, guest: guest, white: white, black: black, timeLeft: timeLeft }
}

let leaveLobbyService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    lobbyFound.filterUserByuserid(userid); // remove user from lobby

    console.log(`user ${userid} left lobby ${lobbyid}`);
}

let getUserActiveLobbyService = (userid) => {
    let isUserInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid);

    return isUserInLobby;
}

let switchSideService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    if (lobbyFound.getCreator().userid !== userid) { // check if user is lobby creator
        throw (new httpError(403, "You are not the lobby creator"));
    }

    lobbyFound.switchSide();
}

let startService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    if (lobbyFound.getCreator().userid !== userid) { // check if user is lobby creator
        throw (new httpError(403, "You are not the lobby creator"));
    }

    let isStarted = lobbyFound.start();

    if (!isStarted) {
        throw (new httpError(403, "Not enough player"));
    }

    console.log(`lobby ${lobbyid} started`);
}

module.exports = { createLobbyService, joinLobbyService, leaveLobbyService, getUserActiveLobbyService, switchSideService, startService }