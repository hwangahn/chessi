const express = require('express');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
const { findGameController, stopFindGameController, getGameController, getUserActiveGameController } = require('../controllers/gameController');
 
let router = express.Router();

router.post('/api/find-game', verifyJWT, verifyAccessToken, findGameController);
router.delete('/api/find-game', verifyJWT, verifyAccessToken, stopFindGameController);
router.get('/api/game-info/:gameid', getGameController);
router.get('/api/user-active-game', verifyJWT, verifyAccessToken, getUserActiveGameController);

module.exports = router;