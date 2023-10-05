const bcrypt = require('bcrypt');
const { sendVerificationMail } = require('../utils/mail');
const { user } = require('../models/user');
const { email } = require('../models/email');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

    return { userEmail: newEmail.email, verificationToken: newEmail.verificationToken }
}

let verifyEmailService = async (token) => {
    let emailFound = await email.findOne({ where: { verificationToken: token }});

    if (!emailFound) {
        throw ({ httpStatus: 404, msg: "Invalid link" });
    } 

    await emailFound.update({ verificationStatus: true });
}

let loginService = async (username, password, socketID) => {

    console.log(socketID);

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

    let accessToken = jwt.sign({ uid: userFound.uid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: '1d' });
    let sessionToken = jwt.sign({ uid: userFound.uid, type: "session token" }, process.env.SECRET_WORD, { expiresIn: '7d' });
    let profile = { uid: userFound.uid, username: userFound.username };

    return { accessToken: accessToken, sessionToken: sessionToken, profile: profile };
}

let requestAccessTokenService = async (uid) => {
    let userFound = await user.findOne({ 
        where: { uid: uid },
        include: { model: email }
    });

    if (!userFound) {
        throw ({ httpStatus: 403, msg: "Please log in again" });
    }
    
    if (!userFound.email.verificationStatus) {
        throw ({ httpStatus: 403, msg: "Verify your email before continue" });
    }

    let accessToken = jwt.sign({ uid: userFound.uid, isAdmin: userFound.isAdmin, type: "access token" }, process.env.SECRET_WORD, { expiresIn: '1d' });
    let profile = { uid: userFound.uid, username: userFound.username };

    return { accessToken: accessToken, profile: profile };
}

module.exports = { signupService, verifyEmailService, loginService, requestAccessTokenService }