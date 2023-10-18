const express = require('express');
const { handleSignup, handleVerifyEmail, handleLogin, handleLogout, handleRequestAccessToken } = require('../controllers/logonController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');

let router = express.Router();

router.post('/api/signup', handleSignup);
router.post('/api/login', handleLogin);
router.post('/api/logout', verifyJWT, verifyAccessToken, handleLogout);
router.get('/verify', handleVerifyEmail);
router.post('/api/gettoken', verifyJWT, handleRequestAccessToken);

module.exports = router;