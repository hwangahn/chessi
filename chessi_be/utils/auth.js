const jwt = require('jsonwebtoken');
require('dotenv').config();

let signJWT = (obj, expiresIn) => {
    return jwt.sign(obj, process.env.SECRET_WORD, { expiresIn: expiresIn });
}

let verifyJWT = (req, res, next) => {
    try {
        let token = req.headers['authorization']?.substring(7);
        if (token) {
            token = jwt.verify(token, process.env.SECRET_WORD);
            req.token = token;
            next();
        } else {
            res.status(401).json({ status: "error", msg: "You are not logged in"});
        }
    } catch(err) {
        console.log(err);
        if (err.name == "TokenExpiredError") {
            res.status(406).json({ status: "error", msg: "Session expired. Please log in again" });
        } else {
            res.status(500).json({ status: "error", msg: "Cannot verify token" });
        }
    }
}

module.exports = { signJWT, verifyJWT };

