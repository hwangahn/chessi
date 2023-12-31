const { postService, postCommentService, getPostService, getAllPostService } = require('../services/postService');
const { checkHttpError } = require('../utils/checkError');

let handlePost = async (req, res) => {
    try {
        let { userid, post } = { userid: req.token.userid, post: req.body.post };

        await postService(userid, post);

        res.status(200).json({ status: "ok" });
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
        
        let { authorName, authorid, post, comments } = await getPostService(postid);

        res.status(200).json({ status: "ok", authorName: authorName, authorid: authorid, post: post, comments: comments });
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