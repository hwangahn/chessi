const { userOnlineCache } = require('../cache/userOnlineCache');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { activeGameCache } = require('../cache/activeGameCache');
const { activeLobby } = require('../cache/lobbyCache');
const { httpError } = require('../error/httpError');


let createLobbyService = (userid) => {
    let isUserInGame = activeGameCache.checkUserInGame(userid); // check if user in game

    if (isUserInGame) {
        throw (new httpError(409, "You are already in a game"));
    }

    matchMakingCache.filterUserByuserid(userid); // remove user from matchmaking cache

    let userFound = userOnlineCache.findUserByuserid(userid);

    if (!userFound) {
        throw (new httpError(403, "Cannot create lobby"))
    }

    let lobbyid = `l_${Date.now()}`;

    activeLobbyCache.addLobby(new activeLobby(lobbyid, userFound)); // add new lobby to cache

    return { lobbyid };
}

let joinLobbyService = (userid, lobbyid) => {
    let userFound = userOnlineCache.findUserByuserid(userid);

    if (!userFound) {
        throw (new httpError(403, "Cannot join lobby"));
    }

    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    let isAddedToLobby = lobbyFound.addUser(userFound); // try adding player to lobby

    if (!isAddedToLobby) {
        throw (new httpError(403, "Lobby full"));
    }
}

let leaveLobbyService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (!lobbyFound) {
        throw (new httpError(404, "Cannot find lobby"));
    }

    lobbyFound.filterUserByuserid(userid); // remove user from lobby
}

let getUserActiveLobbyService = (userid) => {
    let isUserInLobby = activeLobbyCache.checkUserInLobby(userid);

    return isUserInLobby;
}

let switchSideService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (lobbyFound.getCreator().userid !== userid) { // check if user is lobby creator
        throw (new httpError(403, "You are not the lobby creator"));
    }

    lobbyFound.switchSide();
}

let startService = (userid, lobbyid) => {
    let lobbyFound = activeLobbyCache.findLobbyBylobbyid(lobbyid);

    if (lobbyFound.getCreator().userid !== userid) { // check if user is lobby creator
        throw (new httpError(403, "You are not the lobby creator"));
    }

    lobbyFound.start();
}

module.exports = { createLobbyService, joinLobbyService, leaveLobbyService, getUserActiveLobbyService, switchSideService, startService }