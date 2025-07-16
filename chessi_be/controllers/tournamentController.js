const { 
    createTournamentService,
    joinTournamentService,
    leaveTournamentService,
    
    findGameService,
    stopFindGameService,

    startTournamentService,
    endTournamentService,

    getUserActiveTournamentService,

    getActiveTournamentInfoService,
    getPastTournamentInfoService,

    getActiveTournamentsService,
    getPastTournamentsService,

    getActiveTournamentUserGamesService,
    getPastTournamentUserGamesService,
} = require('../services/tournamentService');
const { checkHttpError } = require('../utils/checkError');

// Create a new tournament
let handleCreateTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ status: "error", msg: "Tournament name is required" });
        }
        
        const { tournamentid } = await createTournamentService(userid, name);
        
        res.status(201).json({ status: "ok", tournamentid });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Join a tournament
let handleJoinTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;
        
        joinTournamentService(tournamentid, userid);
        
        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Leave a tournament
let handleLeaveTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;
        
        leaveTournamentService(tournamentid, userid);
        
        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleFindGame = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;

        findGameService(tournamentid, userid);
        
        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleStopFindGame = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;

        stopFindGameService(tournamentid, userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Start a tournament
let handleStartTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;
        
        startTournamentService(tournamentid, userid);
        
        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleEndTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        const { tournamentid } = req.params;
        
        endTournamentService(tournamentid, userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleGetUserActiveTournament = async (req, res) => {
    try {
        const { userid } = req.token;
        
        const { inTournament, tournamentid } = getUserActiveTournamentService(userid);

        res.status(200).json({ status: "ok", inTournament, tournamentid });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleGetActiveTournamentUserGames = async (req, res) => {
    try {
        const { tournamentid, userid } = req.params;
        
        const { games, activeGame } = getActiveTournamentUserGamesService(tournamentid, userid);

        res.status(200).json({ status: "ok", games, activeGame });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

let handleGetPastTournamentUserGames = async (req, res) => {    
    try {
        const { userid } = req.params;
        const { tournamentid } = req.params;
        
        const { games } = await getPastTournamentUserGamesService(tournamentid, userid);

        res.status(200).json({ status: "ok", games });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}   

// Get tournament information
let handleGetActiveTournamentInfo = async (req, res) => {
    try {
        const { tournamentid } = req.params;
        const { userid } = req?.token || {}; // userid is optional
        
        const { tournament, isUserInTournament } = getActiveTournamentInfoService(tournamentid, userid);
        
        res.status(200).json({ status: "ok", tournament, isUserInTournament });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Get past tournament information
let handleGetPastTournamentInfo = async (req, res) => {
    try {
        const { tournamentid } = req.params;

        const tournament = await getPastTournamentInfoService(tournamentid);

        res.status(200).json({ status: "ok", tournament });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Get active tournaments
let handleGetActiveTournaments = async (req, res) => {
    try {        
        const { tournaments } = await getActiveTournamentsService();
        
        res.status(200).json({ status: "ok", tournaments });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

// Get past tournaments
let handleGetPastTournaments = async (req, res) => {
    try {
        const {tournaments} = await getPastTournamentsService();

        res.status(200).json({ status: "ok", tournaments });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        } else {
            res.status(500).json({ status: "error", msg: "Internal server error" });
        }
    }
}

module.exports = {
    handleCreateTournament,
    handleJoinTournament,
    handleLeaveTournament,

    handleFindGame,
    handleStopFindGame,
    
    handleStartTournament,
    handleEndTournament,

    handleGetUserActiveTournament,
    
    handleGetActiveTournamentUserGames,
    handleGetPastTournamentUserGames,

    handleGetActiveTournamentInfo,
    handleGetPastTournamentInfo,
    handleGetActiveTournaments,
    handleGetPastTournaments,
}; 