const bcrypt = require('bcrypt');
const { sendVerificationMail, sendPassword } = require('../utils/mail');
const { user } = require('../models/user');
const { email } = require('../models/email');
const { gameUser } = require('../models/gameUser');
const { game } = require('../models/game');
const { activeUser } = require('../cache/userCache');
const { userOnlineCache } = require('../cache/userOnlineCache');
const { httpError } = require('../error/httpError');
const jwt = require('jsonwebtoken');
const { matchMakingCache } = require('../cache/matchmakingCache');
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

    console.log("new user signed up");
}

let verifyEmailService = async (token) => {
    let emailFound = await email.findOne({ where: { verificationToken: token }});

    if (!emailFound) {
        throw (new httpError(404, "Invalid link"));
    } 

    await emailFound.update({ verificationStatus: true });
}

let loginService = async (username, password, socketid) => {

    let userFound = await user.findOne({ 
        where: { username: username },
        attributes: ["username", "password", "userid", "rating", "isAdmin"],
        include: [
            { 
                model: email,
            },
            {
                model: gameUser, 
                include: {
                    model: game, 
                }
            }
        ]
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

    let userOnlineStatus = userOnlineCache.findUserByuserid(userFound.userid); // find user from online user list to check if user is online

    if (userOnlineStatus) { // if found
        throw (new httpError(409, "This account is logged in on another computer. Log out of the existing session then proceed to log in again"));
    }

    userOnlineCache.addUser(new activeUser(userFound.userid, userFound.username, socketid, userFound.rating, userFound.gameUsers.map(Element =>  Element.side))); // push user to online list

    let accessToken = jwt.sign({ userid: userFound.userid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let sessionToken = jwt.sign({ userid: userFound.userid, type: "session token" }, process.env.SECRET_WORD, { expiresIn: sessionTokenLifetime });
    let profile = { userid: userFound.userid, username: userFound.username, isAdmin: userFound.isAdmin, rating: userFound.rating };

    console.log(`user ${userFound.userid} logged in`)

    return { accessToken: accessToken, sessionToken: sessionToken, profile: profile };
}

let silentLoginService = async (userid, socketid) => {
    let userFound = await user.findOne({ 
        where: { userid: userid },
        attributes: ["username", "userid", "rating", "isAdmin"],
        include: [
            { 
                model: email
            },
            {
                model: gameUser, 
                include: {
                    model: game, 
                }
            }
        ]
    });

    if (!userFound) {
        throw (new httpError(403, "Please log in again"));
    }

    if (!userFound.email.verificationStatus) {
        throw (new httpError(403, "Verify your email before continue"));
    }

    let userOnlineStatus = userOnlineCache.findUserByuserid(userid); // find user from online user list to check if user is online

    if (userOnlineStatus) { // if found
        throw (new httpError(403, "This account is logged in on another computer. Log out of the existing session then proceed to log in again"));
    }

    userOnlineCache.addUser(new activeUser(userFound.userid, userFound.username, socketid, userFound.rating, userFound.gameUsers.map(Element =>  Element.side))); // push user to online list

    let accessToken = jwt.sign({ userid: userFound.userid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: accessTokenLifetime });
    let profile = { userid: userFound.userid, username: userFound.username, isAdmin: userFound.isAdmin, rating: userFound.rating };

    console.log(`user ${userFound.userid} logged in silently`);

    return { accessToken: accessToken, profile: profile };
}

let logoutService = async (userid) => {
    userOnlineCache.filterUserByuserid(userid); // remove user from online user list
    matchMakingCache.filterUserByuserid(userid); // remove user from match making queue if in
}

let resetPasswordService = async (username, _email) => {
    let userFound = await user.findOne({ where: { username: username } });

    if (!userFound) {
        throw (new httpError(404, "Cannot find user with given username/email")); 
    }

    let emailFound = await email.findOne({ 
        where: {
            userid: userFound.userid,
            email: _email
        }
    });

    if (!emailFound) {
        throw (new httpError(404, "Cannot find user with given username/email")); 
    }

    let seed = "afshkfhg" + Date.now() + "alkglw";

    let password = await bcrypt.hash(seed, 5);

    let hashedPassword = await bcrypt.hash(password, 10);

    userFound.update({ password: hashedPassword });

    sendPassword(_email, password);
}

module.exports = { signupService, verifyEmailService, loginService, silentLoginService, logoutService, resetPasswordService }