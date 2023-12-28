const express = require('express')
const { handleGetUserData, handleUserFollow, handleUserUnfollow, handleGetUserFollowing } = require('../controllers/userController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');

let router = express.Router();

router.get('/api/user/following', verifyJWT, verifyAccessToken, handleGetUserFollowing);
router.get('/api/user/:userid', handleGetUserData);
router.post('/api/user/:userid/follow', verifyJWT, verifyAccessToken, handleUserFollow); // userid indicates user to follow
router.delete('/api/user/:userid/follow/', verifyJWT, verifyAccessToken, handleUserUnfollow); // userid indicates user to follow

module.exports = router;