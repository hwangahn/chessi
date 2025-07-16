const express = require('express');
const { verifyJWT, extractToken, verifyAccessToken } = require('../middlewares/auth');
const { 
    handleCreateTournament,
    handleJoinTournament,
    
    handleFindGame,
    handleStopFindGame,

    handleStartTournament,
    handleEndTournament,
    handleLeaveTournament,
    
    handleGetActiveTournamentInfo,
    handleGetPastTournamentInfo,
    handleGetActiveTournaments,
    handleGetPastTournaments,
    
    handleGetActiveTournamentUserGames,
    handleGetPastTournamentUserGames,
    
    handleGetUserActiveTournament,
} = require('../controllers/tournamentController');
 
let router = express.Router();

// Tournament management routes
router.post('/api/tournament/create', verifyJWT, verifyAccessToken, handleCreateTournament);

router.get('/api/tournament/user-active-tournament', verifyJWT, verifyAccessToken, handleGetUserActiveTournament);

router.get('/api/tournaments', handleGetActiveTournaments);
router.get('/api/past/tournaments', handleGetPastTournaments);
router.get('/api/tournament/:tournamentid', extractToken, handleGetActiveTournamentInfo);
router.get('/api/tournament/past/:tournamentid', handleGetPastTournamentInfo);

router.get('/api/tournament/past/:tournamentid/user/:userid/games', handleGetPastTournamentUserGames);
router.get('/api/tournament/:tournamentid/user/:userid/games', handleGetActiveTournamentUserGames);

router.post('/api/tournament/:tournamentid/join', verifyJWT, verifyAccessToken, handleJoinTournament);
router.delete('/api/tournament/:tournamentid/leave', verifyJWT, verifyAccessToken, handleLeaveTournament);
router.post('/api/tournament/:tournamentid/start', verifyJWT, verifyAccessToken, handleStartTournament);
router.post('/api/tournament/:tournamentid/end', verifyJWT, verifyAccessToken, handleEndTournament);

router.post('/api/tournament/:tournamentid/find-game', extractToken, handleFindGame);
router.post('/api/tournament/:tournamentid/stop-find-game', extractToken, handleStopFindGame);

module.exports = router; 