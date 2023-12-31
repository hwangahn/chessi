const { user } = require('../models/user');
const { post } = require('../models/post');
const { comment } = require('../models/comment');

let postService = async (userid, _post) => {
    let usersFound = await user.findOne({ where: { userid: userid }}); // check user exists

    if (!usersFound) { // if not, throw error
        throw (new httpError(404, "Cannot find user"));
    }

    let newPost = await post.create({
        authorid: userid,
        post: _post
    });

    return { postid: newPost.postid, post: newPost.post, timestamp: newPost.timestamp }
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

let getPostService = async (postid) => {
    let postFound = await post.findOne({ 
        where: { postid: postid },
        include: [
            {
                model: user, 
                attributes: ["userid", "username"]
            },
            {
                model: comment,
                attributes: ["comment", "timestamp"],
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
    let author = postFound.user.username;
    let authorid =  postFound.user.userid;
    let _post = postFound.post;
    let timestamp = postFound.timestamp;
    let comments = postFound.comments.map(Element => {
        return { comment: Element.comment, author: Element.user.username, authorid: Element.user.userid, timestamp: Element.timestamp }
    });

    return { author: author, authorid: authorid, post: _post, timestamp: timestamp, comments: comments } 
}

let getAllPostService = async () => {
    let allPosts = await post.findAll({ 
        include: {
            model: user
        },
        order: [["timestamp", "DESC"]],
        limit: 10 
    });

    let normalizedAllPost = allPosts.map(Element => {
        return { postid: Element.postid, author: Element.user.username, post: Element.post, timestamp: Element.timestamp }
    });

    return normalizedAllPost;
}

module.exports = { postService, postCommentService, getPostService,getAllPostService }