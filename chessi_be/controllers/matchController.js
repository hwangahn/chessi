const { checkHttpError } = require('../utils/checkError');

let findMatchController = (req, res) => {
    try {
        let { userid } = req.token;
        
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let stopFindMatchController = (req, res) => {
    try {
        let { userid } = req.token;
        
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { findMatchController, stopFindMatchController }