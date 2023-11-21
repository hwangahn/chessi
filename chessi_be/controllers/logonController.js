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
            res.status(err.getHttpCode()).send("<p>Invalid link"); 
        }
    }
}

let handleLogin = async (req, res) => {
    try {
        let { username, password, socketid } = req.body.data;
         
        let { accessToken, sessionToken, profile } = await loginService(username, password, socketid);

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
        let { userid, socketid } = { userid: req.token.userid, socketid: req.body.socketid };

        let { accessToken, profile } = await silentLoginService(userid, socketid);

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

        res.status(200).json({ status: "ok", msg: "Logged out" });
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: err.getMessage() });
        }
    }
}

module.exports = { handleSignup, handleVerifyEmail, handleLogin, handleLogout, handleSilentLogin }