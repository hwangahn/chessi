const { findMatchService, stopFindMatchService } = require('../services/matchService');
const { checkHttpError } = require('../utils/checkError');

let findMatchController = async (req, res) => {
    try {
        let { userid } = req.token;
        
        await findMatchService(userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let stopFindMatchController = async (req, res) => {
    try {
        let { userid } = req.token;
        
        await stopFindMatchService(userid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { findMatchController, stopFindMatchController }