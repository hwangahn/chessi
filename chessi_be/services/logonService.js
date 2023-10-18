const bcrypt = require('bcrypt');
const { sendVerificationMail } = require('../utils/mail');
const { user } = require('../models/user');
const { email } = require('../models/email');
const { userOnline } = require('../cache/userOnlineCache');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let accessTokenLifetime = '1d';
let sessionTokenLifetime = '7d';

let signupService = async (username, password, userEmail) => {
    let usersFound = await user.findOne({ where: { username: username }});

    if (usersFound) {
        throw ({ httpStatus: 403, msg: "Username Exist" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await user.create({
        username: username, 
        password: hashedPassword, 
        isAdmin: false
    });

    let newEmail = await email.create({
        uid: newUser.uid,
        email: userEmail,
        verificationToken: Date.now()
    });

    await sendVerificationMail(userEmail, newEmail.verificationToken); 
}

let verifyEmailService = async (token) => {
    let emailFound = await email.findOne({ where: { verificationToken: token }});

    if (!emailFound) {
        throw ({ httpStatus: 404, msg: "Invalid link" });
    } 

    await emailFound.update({ verificationStatus: true });
}

let loginService = async (username, password, socketID) => {

    let userFound = await user.findOne({ 
        where: { username: username },
        include: { model: email }
    });

    if (!userFound) {
        throw ({ httpStatus: 401, msg: "Wrong credentials" });
    }

    let checkPassword = await bcrypt.compare(password, userFound.password);

    if (!checkPassword) {
        throw ({ httpStatus: 401, msg: "Wrong credentials" });
    }

    if (!userFound.email.verificationStatus) {
        throw ({ httpStatus: 403, msg: "Verify your email before continue" });
    }

    let userOnlineStatus = userOnline.findUserByUid(userFound.uid) // check if user is online

    if (userOnlineStatus) {
        throw ({ httpStatus: 403, msg: "This account is logged in on another computer. Log out of the existing session then proceed to log in again" });
    }

    userOnline.addUser({ uid: userFound.uid, socketID: socketID, loginTime: Date.now() }); // push user to online list

    let accessToken = jwt.sign({ uid: userFound.uid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let sessionToken = jwt.sign({ uid: userFound.uid, type: "session token" }, process.env.SECRET_WORD, { expiresIn: sessionTokenLifetime });
    let profile = { uid: userFound.uid, username: userFound.username };

    return { accessToken: accessToken, sessionToken: sessionToken, profile: profile };
}

let requestAccessTokenService = async (uid, socketID) => {
    let userFound = await user.findOne({ 
        where: { uid: uid },
        include: { model: email }
    });

    if (!userFound) {
        throw ({ httpStatus: 403, msg: "Please log in again" });
    }

    let userOnlineStatus = userOnline.findUserByUid(uid) // check if user is online

    if (userOnlineStatus) {
        throw ({ httpStatus: 403, msg: "This account is logged in on another computer. Log out of the existing session then proceed to log in again" });
    }

    userOnline.addUser({ uid: uid, socketID: socketID, loginTime: Date.now() }); // push user to online list

    let accessToken = jwt.sign({ uid: userFound.uid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let profile = { uid: userFound.uid, username: userFound.username };

    return { accessToken: accessToken, profile: profile };
}

let logoutService = async (uid) => {
    let userOnlineFound = userOnline.findUserByUid(uid);

    if (userOnlineFound) {
        userOnline.filterUserByUid(uid);
    }
}

module.exports = { signupService, verifyEmailService, loginService, requestAccessTokenService, logoutService }