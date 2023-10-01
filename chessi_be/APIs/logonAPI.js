const express = require('express');
const { handleSignup, handleVerifyEmail, handleLogin, handleRequestToken } = require('../controllers/logonController');
const { verifyJWT } = require('../utils/auth');

let router = express.Router();

router.post('/api/signup', handleSignup);
router.post('/api/login', handleLogin);
router.get('/verify', handleVerifyEmail);
router.get('/api/token', verifyJWT, handleRequestToken);

module.exports = router;