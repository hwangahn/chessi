const express = require('express');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
const { findMatchController, stopFindMatchController } = require('../controllers/matchController');
 
let router = express.Router();

router.post('/api/find-match', verifyJWT, verifyAccessToken, findMatchController);
router.post('/api/stop-find-match', verifyJWT, verifyAccessToken, stopFindMatchController);

module.exports = router;