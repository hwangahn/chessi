const { getUserDataService, userFollowService, userUnfollowService, getUserFollowingService, getLeaderboardService } = require('../services/userService')
const { checkHttpError } = require('../utils/checkError')

let handleGetUserData = async (req, res) => {
    try {
        let { userid, currentuserid } = { userid: req.params.userid, currentuserid: req.query.currentuserid  };

        console.log(currentuserid);

        let { username, rating, ratingChange, gameHistory, posts, isFollowing } = await getUserDataService(userid, currentuserid);

        res.status(200).json({ status: "ok", msg: "Done", username: username, rating: rating, ratingChange: ratingChange, gameHistory: gameHistory, posts: posts, isFollowing });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleUserFollow = async (req, res) => {
    try {
        let { followerid, userid } = { followerid: req.token.userid, userid: req.params.userid } // userid indicates user to follow

        await userFollowService(followerid, userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleUserUnfollow = async (req, res) => {
    try {
        let { followerid, userid } = { followerid: req.token.userid, userid: req.params.userid } // userid indicates user to follow\

        await userUnfollowService(followerid, userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleGetUserFollowing = async (req, res) => {
    try {
        let { userid } = req.token;
        
        let data = await getUserFollowingService(userid);

        res.status(200).json({ status: "ok", following: data });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleGetLeaderboard = async (req, res) => {
    try {        
        let leaderboard = await getLeaderboardService();

        res.status(200).json({ status: "ok", leaderboard: leaderboard });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleGetUserData, handleUserFollow, handleUserUnfollow, handleGetUserFollowing, handleGetLeaderboard }