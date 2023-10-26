const jwt = require('jsonwebtoken');
require('dotenv').config();

let verifyJWT = (req, res, next) => {
    try {
        let token = req.headers['authorization']?.substring(7);
        if (!token) {
            return res.status(401).json({ status: "error", msg: "You are not logged in"});  
        } 

        token = jwt.verify(token, process.env.SECRET_WORD);
        req.token = token;
        next();
    } catch(err) {
        console.log(err);
        if (err.name == "TokenExpiredError") {
            return res.status(401).json({ status: "error", msg: "Session expired. Please log in again" });
        }
        res.status(500).json({ status: "error", msg: "Cannot verify token" });
    }
}

let verifySessionToken = (req, res, next) => {
    if (req.token.type !== "session token") {
        return res.status(401).json({ status: "error", msg: "Cannot verify session"});
    }
    next();
}

let verifyAccessToken = (req, res, next) => {
    if (req.token.type !== "access token") {
        return res.status(401).json({ status: "error", msg: "You are not logged in"});
    }
    next();
}

module.exports = { verifyJWT, verifyAccessToken, verifySessionToken };

