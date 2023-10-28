const { signupService, verifyEmailService, loginService, silentLoginService, logoutService } = require('../services/logonService');
const { checkHttpError } = require('../utils/checkError');

let handleSignup = async (req, res) => {
    try {
        let { username, password, email } = req.body.data;

        await signupService(username, password, email);

        res.status(200).json({ status: "ok", msg: "Head over to your mailbox for verification" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleVerifyEmail = async (req, res) => {
    try {
        let token = req.query.token;

        await verifyEmailService(token);

        res.status(200).send("<p>Your account has been activated. Click <a href='http://localhost:3000/login' target='blank'>here</a> to login</p>"); 
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleLogin = async (req, res) => {
    try {
        let { username, password, socketID } = req.body.data;
         
        let { accessToken, sessionToken, profile } = await loginService(username, password, socketID);

        res.status(200).json({ status: "ok", msg: "Logged in", accessToken: accessToken, sessionToken: sessionToken, profile: profile });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleSilentLogin = async (req, res) => {
    try {
        let { userid, socketID } = { userid: req.token.userid, socketID: req.body.socketID };

        let { accessToken, profile } = await silentLoginService(userid, socketID);

        res.status(200).json({ status: "ok", msg: "Logged in", accessToken: accessToken, profile: profile });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

let handleLogout = async (req, res) => {
    try {
        let { userid } = req.token;

        await logoutService(userid);
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleSignup, handleVerifyEmail, handleLogin, handleLogout, handleSilentLogin }