const express = require('express');
const { handleSignup, handleVerifyEmail, handleLogin, handleRequestAccessToken } = require('../controllers/logonController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');

let router = express.Router();

router.post('/api/signup', handleSignup);
router.post('/api/login', handleLogin);
router.get('/verify', handleVerifyEmail);
router.get('/api/token', verifyJWT, handleRequestAccessToken);

module.exports = router;