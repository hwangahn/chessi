const express = require('express');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
const { handleFindGame, handleStopFindGame, handleGetGame, handleGetUserActiveGame } = require('../controllers/gameController');
 
let router = express.Router();

router.post('/api/game/find-game', verifyJWT, verifyAccessToken, handleFindGame);
router.delete('/api/game/find-game', verifyJWT, verifyAccessToken, handleStopFindGame);
router.get('/api/game/user-active-game', verifyJWT, verifyAccessToken, handleGetUserActiveGame);
router.get('/api/game/:gameid', handleGetGame);

module.exports = router;