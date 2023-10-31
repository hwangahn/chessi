const express = require('express');
const { handleSignup, handleVerifyEmail, handleLogin, handleLogout, handleSilentLogin } = require('../controllers/logonController');
const { verifyJWT, verifyAccessToken, verifySessionToken } = require('../middlewares/auth');
 
let router = express.Router();

router.post('/api/signup', handleSignup);
router.post('/api/login', handleLogin);
router.post('/api/logout', verifyJWT, verifyAccessToken, handleLogout);
router.get('/verify', handleVerifyEmail);
router.post('/api/silent-login', verifyJWT, verifySessionToken, handleSilentLogin);

module.exports = router;