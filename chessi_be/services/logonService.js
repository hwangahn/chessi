const bcrypt = require('bcrypt');
const { sendVerificationMail } = require('../utils/mail');
const { user } = require('../models/user');
const { email } = require('../models/email');
const { userOnline } = require('../cache/userOnlineCache');
const { httpError } = require('../error/httpError');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let accessTokenLifetime = '1d';
let sessionTokenLifetime = '7d';

let signupService = async (username, password, userEmail) => {
    let usersFound = await user.findOne({ where: { username: username }});

    if (usersFound) {
        throw (new httpError(403, "Username Exist"));
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await user.create({
        username: username, 
        password: hashedPassword, 
        isAdmin: false,
        rating: 1500
    });

    let newEmail = await email.create({
        userid: newUser.userid,
        email: userEmail,
        verificationToken: Date.now()
    });

    await sendVerificationMail(userEmail, newEmail.verificationToken); 
}

let verifyEmailService = async (token) => {
    let emailFound = await email.findOne({ where: { verificationToken: token }});

    if (!emailFound) {
        throw (new httpError(404, "Invalid link"));
    } 

    await emailFound.update({ verificationStatus: true });
}

let loginService = async (username, password, socketID) => {

    let userFound = await user.findOne({ 
        where: { username: username },
        include: { model: email }
    });

    if (!userFound) {
        throw (new httpError(401, "Wrong credentials"));
    }

    let checkPassword = await bcrypt.compare(password, userFound.password);

    if (!checkPassword) {
        throw (new httpError(401, "Wrong credentials"));
    }

    if (!userFound.email.verificationStatus) {
        throw (new httpError(403, "Verify your email before continue"));
    }

    let userOnlineStatus = userOnline.findUserByuserid(userFound.userid); // find user from online user list to check if user is online

    if (userOnlineStatus) { // if found
        throw (new httpError(403, "This account is logged in on another computer. Log out of the existing session then proceed to log in again"));
    }

    userOnline.addUser({ userid: userFound.userid, socketid: socketID, loginTime: Date.now() }); // push user to online list

    let accessToken = jwt.sign({ userid: userFound.userid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let sessionToken = jwt.sign({ userid: userFound.userid, type: "session token" }, process.env.SECRET_WORD, { expiresIn: sessionTokenLifetime });
    let profile = { userid: userFound.userid, username: userFound.username };

    return { accessToken: accessToken, sessionToken: sessionToken, profile: profile };
}

let silentLoginService = async (userid, socketID) => {
    let userFound = await user.findOne({ 
        where: { userid: userid },
        include: { model: email }
    });

    if (!userFound) {
        throw (new httpError(403, "Please log in again"));
    }

    let userOnlineStatus = userOnline.findUserByuserid(userid); // find user from online user list to check if user is online

    if (userOnlineStatus) { // if found
        throw (new httpError(403, "This account is logged in on another computer. Log out of the existing session then proceed to log in again"));
    }

    userOnline.addUser({ userid: userid, socketid: socketID, loginTime: Date.now() }); // push user to online list

    let accessToken = jwt.sign({ userid: userFound.userid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let profile = { userid: userFound.userid, username: userFound.username };

    return { accessToken: accessToken, profile: profile };
}

let logoutService = async (userid) => {
    let userOnlineFound = userOnline.findUserByuserid(userid);

    if (userOnlineFound) {
        userOnline.filterUserByuserid(userid);
    }
}

module.exports = { signupService, verifyEmailService, loginService, silentLoginService, logoutService }