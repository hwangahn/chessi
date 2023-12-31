const { activeGameCache } = require('../cache/activeGameCache');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { userOnlineCache } = require('../cache/userOnlineCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { game } = require('../models/game');
const { user } = require('../models/user');
const { gameUser } = require('../models/gameUser');
const { move } = require('../models/move.js')
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
    let gameFound = activeGameCache.findGameBygameid(gameid); // check whether game is active

    if (!gameFound) {
        throw new httpError(404, "Cannot find game");
    }

    return gameFound.getGameInfo();
}

let getUserActiveGameService = async (userid) => {
    let isUserInGame = activeGameCache.checkUserInGame(userid);

    return isUserInGame;
}

let getGamePlayedService = async (gameid) => {
    let gameFound = await game.findOne({ where: { gameid: gameid }});

    if (!gameFound) {
        throw new httpError(404, "Cannot find game");
    }

    let white = await gameUser.findOne({ 
        where: { 
            gameid: gameid,
            side: "white"
        },
        include: {
            model: user,
            attributes: ["username", "rating"]
        }
    });

    let black = await gameUser.findOne({ 
        where: { 
            gameid: gameid,
            side: "black"
        },
        include: {
            model: user,
            attributes: ["username", "rating"]
        }
    });

    black = { userid: black.userid, username: black.user.username, rating: black.user.rating }
    white = { userid: white.userid, username: white.user.username, rating: white.user.rating }

    let moves = await move.findAll({ 
        where: { gameid: gameid },
        order: [["moveOrder", "ASC"]] 
    });

    let normalizedMoves = moves.map(Element => {
        return { moveOrder: Element.moveOrder, side: Element.side, notation: Element.notation, fen: Element.fen }
    })

    console.log(normalizedMoves);
    console.log(black);
    console.log(white);

    return { reason: gameFound.reason, moves: normalizedMoves, white: white, black: black }
}

module.exports = { findGameService, stopFindGameService, getGameService, getUserActiveGameService, getGamePlayedService }