const express = require('express');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
const { handleStartCompGame } = require('../controllers/compGameController');

let router = express.Router();

router.post('/api/comp-game/start', verifyJWT, verifyAccessToken, handleStartCompGame); // start computer game

module.exports = router;