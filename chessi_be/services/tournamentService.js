const { tournament: tournamentCache } = require('../cache/tournamentCache');
const { userOnlineCache } = require('../cache/userOnlineCache');
const { activeGameCache } = require('../cache/activeGameCache');
const { activeLobbyCache } = require('../cache/activeLobbyCache');
const { activeTournamentCache } = require('../cache/activeTournamentCache');
const { matchMakingCache } = require('../cache/centralMatchmakingCache');
const { httpError } = require('../error/httpError');
const { tournament: tournamentModel } = require('../models/tournament');
const { tournamentUser } = require('../models/tournamentUser');
const { tournamentGame } = require('../models/tournamentGame');
const { game } = require('../models/game');

// Create a new tournament
let createTournamentService = (organizerid, name, gameTime = 10 * 60, tournamentTime = 10 * 60) => {
    // Check if organizer is online
    const organizer = userOnlineCache.findUserByuserid(organizerid);
    if (!organizer) {
        throw new httpError(403, "Organizer must be online to create tournament");
    }

    // Check if organizer is already in a game or lobby
    const isInGame = activeGameCache.checkUserInGame(organizerid).inGame;
    if (isInGame) {
        throw new httpError(409, "Cannot create tournament while in a game");
    }

    const isInLobby = activeLobbyCache.checkUserInLobbyByuserid(organizerid).inLobby;
    if (isInLobby) {
        throw new httpError(409, "Cannot create tournament while in a lobby");
    }

    // Generate tournament ID
    const tournamentid = `${Date.now()}`;

    // Create new tournament
    const tournament = new tournamentCache(tournamentid, organizerid, name, gameTime, tournamentTime);

    // Add organizer as first player
    tournament.addPlayer(organizer);

    // Add tournament to cache
    activeTournamentCache.addTournament(tournament);

    console.log(`Tournament ${tournamentid} created by ${organizerid}`);

    return { tournamentid: tournament.tournamentid };
}

// Join a tournament
let joinTournamentService = (tournamentid, userid) => {
    // Check if user is online
    const user = userOnlineCache.findUserByuserid(userid);
    if (!user) {
        throw new httpError(403, "User must be online to join tournament");
    }

    // Check if user is already in a game or lobby
    const isInGame = activeGameCache.checkUserInGame(userid).inGame;
    if (isInGame) {
        throw new httpError(409, "Cannot join tournament while in a game");
    }

    const isInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid).inLobby;
    if (isInLobby) {
        throw new httpError(409, "Cannot join tournament while in a lobby");
    }

    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Add player to tournament
    tournament.addPlayer(user);

    console.log(`User ${userid} joined tournament ${tournamentid}`);
}

let findGameService = (tournamentid, userid) => {
    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Check if user is in tournament
    if (!tournament.isPlayerInTournament(userid)) {
        throw new httpError(404, "Not registered for this tournament");
    }

    let isUserInGame = activeGameCache.checkUserInGame(userid).inGame;

    if (isUserInGame) {
        throw new httpError(409, "Cannot find game. Try again later");
    }

    let isUserInLobby = activeLobbyCache.checkUserInLobbyByuserid(userid).inLobby;

    if (isUserInLobby) {
        throw new httpError(409, "Cannot find game. Try again later");
    }

    matchMakingCache.filterUserByuserid(userid); // remove user from match making queue first


    // Find game
    tournament.userFindGame(userid);

    console.log(`User ${userid} start finding game in tournament ${tournamentid}`);
}

let stopFindGameService = (tournamentid, userid) => {
    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Check if user is in tournament
    if (!tournament.isPlayerInTournament(userid)) {
        throw new httpError(404, "Not registered for this tournament");
    }

    // Stop finding game
    tournament.userStopFindGame(userid);

    console.log(`User ${userid} stop finding game in tournament ${tournamentid}`);
}

// Leave a tournament
let leaveTournamentService = (tournamentid, userid) => {
    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Check if user is in tournament
    if (!tournament.isPlayerInTournament(userid)) {
        throw new httpError(404, "Not registered for this tournament");
    }

    if (tournament.isOrganizer(userid)) {
        throw new httpError(403, "Organizer cannot leave tournament");
    }

    // Remove player from tournament
    tournament.removePlayer(userid);

    console.log(`User ${userid} left tournament ${tournamentid}`);
}

// Start a tournament
let startTournamentService = (tournamentid, userid) => {
    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);

    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Check if user is organizer
    if (!tournament.isOrganizer(userid)) {
        throw new httpError(403, "Only organizer can start tournament");
    }

    let tournamentStarted = tournament.startTournament();

    if (!tournamentStarted) {
        throw new httpError(409, "Tournament already started");
    }

    console.log(`Tournament ${tournamentid} started by user ${userid}`);
}

let endTournamentService = (tournamentid, userid) => {
    // Find tournament
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Check if user is organizer
    if (!tournament.isOrganizer(userid)) {
        throw new httpError(403, "Only organizer can end tournament");
    }

    // End tournament
    let tournamentEnded = tournament.endTournament();

    if (!tournamentEnded) {
        throw new httpError(409, "Tournament already ended");
    }

    console.log(`Tournament ${tournamentid} ended by ${userid}`);
}

let getUserActiveTournamentService = (userid) => {
    const userTournament = activeTournamentCache.checkUserInTournament(userid);

    return userTournament;
}

let getActiveTournamentUserGamesService = (tournamentid, userid) => {
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    let { games, activeGame } = tournament.getUserGames(userid);

    return { games, activeGame };
}

let getPastTournamentUserGamesService = async (tournamentid, userid) => {
    let tournament = await tournamentModel.findOne({
        where: { tournamentid: tournamentid },
        include: [
            {
                model: tournamentUser
            }, {
                model: tournamentGame
            }
        ]
    });

    let games = tournament.tournamentGames.filter(game => game.whiteid == userid || game.blackid == userid);

    games = games.map(game => {
        let side = game.whiteid == userid ? "white" : "black";
        let opponent = game.whiteid == userid ? {
            userid: game.blackid,
            username: game.blackUsername,
            rating: game.blackRating
        } : {
            userid: game.whiteid,
            username: game.whiteUsername,
            rating: game.whiteRating
        };
        let result = game.outcome == "draw" ? "d" : 
                    (game.winner == side ? "w" : "l");

        return {
            gameid: game.gameid,
            opponent,
            result,
            side
        };
    });

    return { games };
}

// Get all active tournaments
let getActiveTournamentsService = () => {
    let tournaments = activeTournamentCache.getAllTournaments();

    return { tournaments: tournaments.map(t => t.getTournamentInfo()) };
}

let getPastTournamentsService = async () => {
    let tournaments = await tournamentModel.findAll();

    return { tournaments };
}

// Get tournament information
let getActiveTournamentInfoService = (tournamentid, userid = null) => {
    const tournament = activeTournamentCache.findTournamentByid(tournamentid);
    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    let isUserInTournament = tournament.isPlayerInTournament(userid);

    return { tournament: tournament.getTournamentInfo(), isUserInTournament };
}

// Get tournament information
let getPastTournamentInfoService = async (tournamentid) => {
    let tournament = await tournamentModel.findOne({
        where: { tournamentid: tournamentid },
        include: [
            {
                model: tournamentUser
            }, {
                model: tournamentGame
            }
        ]
    });

    if (!tournament) {
        throw new httpError(404, "Tournament not found");
    }

    // Initialize standings object with all players having 0 points
    const standings = {};

    // Initialize all players with 0 points
    tournament.tournamentUsers.forEach(player => {
        standings[player.userid] = {
            userid: player.userid,
            username: player.username,
            rating: player.rating,
            points: player.points,
            gameResults: [] // Array to store game results: 'w' for win, 'd' for draw, 'l' for loss
        };
    });

    // Calculate points from completed games
    tournament.tournamentGames.forEach(game => {
        const whitePlayer = standings[game.whiteid];
        const blackPlayer = standings[game.blackid];

        if (game.outcome === "draw") {
            // Draw - both players get 0.5 points
            if (whitePlayer) {
                whitePlayer.gameResults.push('d');
            }
            if (blackPlayer) {
                blackPlayer.gameResults.push('d');
            }
        } else if (game.outcome === "not draw") {
            // Not a draw - determine winner
            if (game.winner === "white") {
                if (whitePlayer) {
                    whitePlayer.gameResults.push('w');
                }
                if (blackPlayer) {
                    blackPlayer.gameResults.push('l');
                }
            } else if (game.winner === "black") {
                if (blackPlayer) {
                    blackPlayer.gameResults.push('w');
                }
                if (whitePlayer) {
                    whitePlayer.gameResults.push('l');
                }
            }
        }
    });

    // Convert to array and sort by points (descending), then by rating (descending)
    const standingsArray = Object.values(standings).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.rating - a.rating;
    });

    return {
        tournamentid: tournament.tournamentid,
        name: tournament.name,
        players: standingsArray,
        timestamp: tournament.timestamp,
        gameTime: tournament.gameTime,
    };
}

module.exports = {
    createTournamentService,
    joinTournamentService,
    leaveTournamentService,

    findGameService,
    stopFindGameService,

    startTournamentService,
    endTournamentService,


    getUserActiveTournamentService,

    getActiveTournamentsService,
    getPastTournamentsService,
    getPastTournamentInfoService,
    getActiveTournamentInfoService,

    getActiveTournamentUserGamesService,
    getPastTournamentUserGamesService,
};