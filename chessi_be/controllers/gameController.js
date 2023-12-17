const { findGameService, stopFindGameService, getGameService, getUserActiveGameService } = require('../services/gameService');
const { checkHttpError } = require('../utils/checkError');

let findGameController = async (req, res) => {
    try {
        let { userid } = req.token;
        
        await findGameService(userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let stopFindGameController = async (req, res) => {
    try {
        let { userid } = req.token;
        
        await stopFindGameService(userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let getGameController = async (req, res) => {
    try {
        let gameid  = req.params.gameid;

        let gameInfo = await getGameService(gameid);

        res.status(200).json({ status: "ok", gameInfo: gameInfo });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let getUserActiveGameController = async (req, res) => {
    try {
        let userid = req.token.userid;

        let { inGame, gameid } = await getUserActiveGameService(userid);

        res.status(200).json({ status: "ok", inGame: inGame, gameid: gameid });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { findGameController, stopFindGameController, getGameController, getUserActiveGameController }