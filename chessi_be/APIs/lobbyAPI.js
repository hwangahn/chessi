const express = require('express');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
const { handleCreateLobby, handleJoinLobby, handleLeaveLobby, handleUserActiveLobby, handleSwitchSide, handleStart } = require('../controllers/lobbyController');

let router = express.Router();

router.post('/api/lobby', verifyJWT, verifyAccessToken, handleCreateLobby); // create lobby
router.post('/api/lobby/:lobbyid', verifyJWT, verifyAccessToken, handleJoinLobby); // join lobby if has enought slot
router.delete('/api/lobby/:lobbyid', verifyJWT, verifyAccessToken, handleLeaveLobby); // leave lobby
router.get('/api/lobby/user-active-lobby', verifyJWT, verifyAccessToken, handleUserActiveLobby) // get user's active lobby
router.post('/api/lobby/:lobbyid/switch-side', verifyJWT, verifyAccessToken, handleSwitchSide); // switch side in game (black white)
router.post('/api/lobby/:lobbyid/start', verifyJWT, verifyAccessToken, handleStart) // start game

module.exports = router;