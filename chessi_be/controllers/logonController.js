const bcrypt = require('bcrypt');
const { user } = require('../models/user');
const { email } = require('../models/email');
const { sendVerificationMail } = require('../utils/mail');
const { signJWT } = require('../utils/auth');

const saltRounds = 10;

let handleSignup = async (req, res) => {
    try {
        let usersFound = await user.findOne({ where: { username: req.body.data.username }});

        if (usersFound === null) {
            let hashedPassword = await bcrypt.hash(req.body.data.password, saltRounds);

            let newUser = await user.create({
                username: req.body.data.username, 
                password: hashedPassword, 
                isAdmin: false
            });

            let newEmail = await email.create({
                uid: newUser.uid,
                email: req.body.data.email,
                verificationToken: Date.now()
            });

            await sendVerificationMail(newEmail.email, newEmail.verificationToken);

            res.status(200).json({ status: "ok", msg: "Head over to your mailbox for verification" });
        } else {
            res.status(403).json({ status: "error", msg: "Username Exist" });
        }
    } catch(err) {
        console.log(err);
    }
}

let handleVerifyEmail = async (req, res) => {
    try {
        let token = req.query.token;

        let emailFound = await email.findOne({ where: { verificationToken: token }});

        if (emailFound === null) {
            res.status(404).send("Invalid link");
        } else {
            await emailFound.update({ verificationStatus: true });
            res.status(200).send("<p>Your account has been activated. Click <a href='http://localhost:3000/login' target='blank'>here</a> to login</p>"); 
        }
    } catch(err) {
        console.log(err);
    }
}

let handleLogin = async (req, res) => {
    try {
        let userFound = await user.findOne({ 
            where: { username: req.body.data.username },
            include: { model: email }
        });

        if (userFound === null) {
            res.status(401).json({ status: "error", msg: "Wrong credentials" });
        } else {
            let checkPassword = await bcrypt.compare(req.body.data.password, userFound.password);

            if (checkPassword) {
                let accessToken = signJWT({ uid: userFound.uid, isAdmin: userFound.isAdmin }, '1d');
                let sessionToken = signJWT({ uid: userFound.uid }, '7d');
                (userFound.email.verificationStatus) ? res.status(200).json({ status: "ok", msg: "Logged in", accessToken: accessToken, sessionToken: sessionToken }) :
                                                        res.status(403).json({ status: "error", msg: "Head over to your mailbox to veridy your email before logging in" });
            } else {
                res.status(401).json({ status: "error", msg: "Wrong credentials" });
            }
        }
    } catch(err) {
        console.log(err)
    }
}

let handleRequestToken = async (req, res) => {
    try {
        let userFound = await user.findOne({ 
            where: { uid: req.token.uid }
        });

        let accessToken = signJWT({ id: userFound.uid, isAdmin: userFound.isAdmin }, '1d');
        (userFound) ? res.status(200).json({ status: "ok", msg: "Logged in", accessToken: accessToken }) :
                    res.status(403).json({ status: "error", msg: "Please log in again" });

    } catch(err) {
        console.log(err)
    }
}

module.exports = { handleSignup, handleVerifyEmail, handleLogin, handleRequestToken }