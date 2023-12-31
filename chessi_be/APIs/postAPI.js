const express = require('express');
const { handlePost, handlePostComment, handleGetPost, handleGetAllPost } = require('../controllers/postController');
const { verifyJWT, verifyAccessToken } = require('../middlewares/auth');
 
let router = express.Router();

router.post('/api/post', verifyJWT, verifyAccessToken, handlePost); // create post
router.post('/api/post/:postid/comment', verifyJWT, verifyAccessToken, handlePostComment); // create comment on post id
router.get('/api/post', handleGetAllPost);
router.get('/api/post/:postid', handleGetPost); // get post info and all comment

module.exports = router;