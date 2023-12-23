const { createLobbyService, joinLobbyService, leaveLobbyService, getUserActiveLobbyService, switchSideService, startService } = require('../services/lobbyService');
const { checkHttpError } = require('../utils/checkError');

let handleCreateLobby = (req, res) => {
    try {
        let { userid } = req.token;

        let { lobbyid } = createLobbyService(userid);

        res.status(200).json({ status: "ok", lobbyid: lobbyid });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleJoinLobby = (req, res) => {
    try {
        let { userid, lobbyid } = { userid: req.token.userid, lobbyid: req.params.lobbyid }

        joinLobbyService(userid, lobbyid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
} 

let handleLeaveLobby = (req, res) => {
    try {
        let { userid, lobbyid } = { userid: req.token.userid, lobbyid: req.params.lobbyid }

        leaveLobbyService(userid, lobbyid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleUserActiveLobby = (req, res) => {
    try {
        let userid = req.token.userid;

        let { inLobby, lobbyid } = getUserActiveLobbyService(userid);

        res.status(200).json({ status: "ok", inLobby: inLobby, lobbyid: lobbyid });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleSwitchSide = (req, res) => {
    try {
        let { userid, lobbyid } = { userid: req.token.userid, lobbyid: req.params.lobbyid }

        switchSideService(userid, lobbyid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleStart = (req, res) => {
    try {
        let { userid, lobbyid } = { userid: req.token.userid, lobbyid: req.params.lobbyid }

        startService(userid, lobbyid);

        res.status(200).json({ status: "ok" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleCreateLobby, handleJoinLobby, handleLeaveLobby, handleUserActiveLobby, handleSwitchSide, handleStart }