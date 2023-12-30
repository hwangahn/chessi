const { user } = require('../models/user');
const { post } = require('../models/post');
const { comment } = require('../models/comment');

let postService = async (userid, _post) => {
    let usersFound = await user.findOne({ where: { userid: userid }}); // check user exists

    if (!usersFound) { // if not, throw error
        throw (new httpError(404, "Cannot find user"));
    }

    await post.create({
        authorid: userid,
        post: _post
    });
}

let postCommentService = async (userid, postid, _comment) => {
    let usersFound = await user.findOne({ where: { userid: userid }}); // check user exist

    if (!usersFound) { // if not, throw error
        throw (new httpError(404, "Cannot find user"));
    }

    let postFound = await post.findOne({ where: { postid: postid }}); // check post exists

    if (!postFound) { // if not, throw error
        throw (new httpError(404, "Cannot find post"));
    }

    await comment.create({
        postid: postid,
        authorid: userid,
        comment: _comment
    });
}

let getPost = async (postid) => {
    let postFound = await post.findOne({ 
        where: { postid: postid },
        include: [
            {
                model: user, 
                attributes: ["userid", "username"]
            },
            {
                model: comment,
                attributes: ["comment"],
                include: {
                    model: user, 
                    attributes: ["userid", "username"]
                }
            }
        ],
    }); 

    if (!postFound) { // if not, throw error
        throw (new httpError(404, "Cannot find post"));
    }

    // normalizing return value
    let authorName = postFound.user.username;
    let authorid =  postFound.user.userid;
    let _post = postFound.post;
    let comments = postFound.comments.map(Element => {
        return { comment: Element.comment, authorName: Element.user.username, authorid: Element.user.userid }
    });

    return { authorName: authorName, authorid: authorid, post: _post, comments: comments } 
}
module.exports = { postService, postCommentService, getPost }