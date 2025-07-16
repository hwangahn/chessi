const { startCompGameService } = require('../services/compGameService');
const { checkHttpError } = require('../utils/checkError');

let handleStartCompGame = (req, res) => {
    try {
        let { userid } = { userid: req.token.userid }

        startCompGameService(userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleStartCompGame }