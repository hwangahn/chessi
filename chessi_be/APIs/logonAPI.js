const express = require('express');
const { handleSignup, handleVerifyEmail, handleLogin, handleLogout, handleSilentLogin, handleResetPassword } = require('../controllers/logonController');
const { verifyJWT, verifyAccessToken, verifySessionToken } = require('../middlewares/auth');
 
let router = express.Router();

router.post('/api/signup', handleSignup);
router.post('/api/login', handleLogin);
router.post('/api/reset-password', handleResetPassword);
router.post('/api/logout', verifyJWT, verifyAccessToken, handleLogout);
router.post('/api/silent-login', verifyJWT, verifySessionToken, handleSilentLogin);
router.get('/verify', handleVerifyEmail);

module.exports = router;