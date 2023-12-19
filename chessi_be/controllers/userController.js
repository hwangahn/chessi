const { getUserDataService } = require('../services/userService')
const { checkHttpError } = require('../utils/checkError')

let handleGetUserData = async (req, res) => {
    try {
        let userid = req.params.userid;

        let { username, rating, ratingChange, gameHistory } = await getUserDataService(userid);

        res.status(200).json({ status: "ok", msg: "Done", username: username, rating: rating, ratingChange: ratingChange, gameHistory: gameHistory });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleGetUserData }