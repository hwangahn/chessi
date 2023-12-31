const { postService, postCommentService, getPostService, getAllPostService } = require('../services/postService');
const { checkHttpError } = require('../utils/checkError');

let handlePost = async (req, res) => {
    try {
        let { userid, _post } = { userid: req.token.userid, _post: req.body.post };

        let { postid, post, timestamp } = await postService(userid, _post);

        res.status(200).json({ status: "ok", postid: postid, post: post, timestamp: timestamp });
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handlePostComment = async (req, res) => {
    try {
        let { userid, postid, comment } = { userid: req.token.userid, postid: req.params.postid, comment: req.body.comment }

        await postCommentService(userid, postid, comment);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleGetPost = async (req, res) => {
    try {
        let postid = req.params.postid;
        
        let { author, authorid, post, comments } = await getPostService(postid);

        res.status(200).json({ status: "ok", author: author, authorid: authorid, post: post, comments: comments });
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

let handleGetAllPost = async (req, res) => {
    try {
        let allPost = await getAllPostService();

        res.status(200).json({ status: "ok", posts: allPost });
    } catch(err) {
        console.log(err)
        if(checkHttpError(err)) {
            res.status(err.getHttpCode()).json({status: "error", msg: err.getMessage()})
        }
    }
}

module.exports = { handlePost, handlePostComment, handleGetPost, handleGetAllPost }