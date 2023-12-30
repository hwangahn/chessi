const bcrypt = require('bcrypt')
const { user } = require('../models/user')
const { game } = require('../models/game')
const { gameUser } = require('../models/gameUser')
const { httpError } = require('../error/httpError')
const { email } = require('../models/email')
const { Op } = require('sequelize')
const { userOnlineCache } = require('../cache/userOnlineCache')


let getAllUserDataService = async () => {
    // get all user id, name, rating from database
    let data = await user.findAll({
        where: { isAdmin: false },
        attributes: ["userid", "username", "rating"]
    })

    return data
}

let getAdminAccountService = async (userid) => {

    // get admin name
    let data = await user.findOne({
        where: { 
            [Op.and]: {
                userid: userid,
                isAdmin: true
            }
        },
        attributes: ['username','isadmin']
    })

    if (!data) {
        throw (new httpError(404, "Cannot find admin"))
    }

    return data

}

let putAdminAccountService = async (username, password, _email ) => {
    let usersFound = await user.findOne({ where: { username: username }});

    if (usersFound) {
        throw (new httpError(403, "Username already used"));
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newAdmin =  await user.create({
        username: username,
        password: hashedPassword,
        isAdmin: true,
        rating: -1
    });

    await email.create({
        userid: newAdmin.userid,
        email: _email,
        verificationToken: -1,
        verificationStatus: true
    })

    console.log("new admin added");
}

let deleteAdminAccountService = async (userid) => {

    let usersFound = await user.findOne({ where: { userid: userid }});

    if (!usersFound) {
        throw (new httpError(404, "Cannot find admin"));
    }

    await user.destroy({
        where: {
          userid: userid
        }
    });

    console.log("admin deleted")
}

let getAllAdminDataService = async () => {
    let data = await user.findAll({
        where: {
            isAdmin: true 
        },
        attributes: ['userid', 'username', 'rating']
    })

    return data
}


let getAllGameDataService = async () => {
    // get all game data in database
    let gameHistoryList = await game.findAll({ // get all games user played
        include: {
            model: gameUser
        },
        order: [['gameid', 'DESC']]
    });

    let conditions = gameHistoryList.map(Element => { // building condition array for Sequelize query
        return { gameid: Element.gameid }
    });

    let gameUserInfo = await gameUser.findAll({ // get info of games user played
        where: { 
            [Op.or]: conditions
        }, 
        include: {
            model: user
        },
        order: [['gameid', 'DESC']]
    });

    let normalizedGameHistory = new Array;

    for (let i = 0; i < gameHistoryList.length; i++) {
        normalizedGameHistory.push({
            gameid: gameHistoryList[i].gameid,
            reason: gameHistoryList[i].reason,
            timestamp: gameHistoryList[i].timestamp,
            finalFen: gameHistoryList[i].finalFen,
            white: gameUserInfo[i * 2].side === "white" ? gameUserInfo[i * 2].user.username : gameUserInfo[i * 2 + 1].user.username,
            black: gameUserInfo[i * 2].side === "black" ? gameUserInfo[i * 2].user.username : gameUserInfo[i * 2 + 1].user.username,
            whiteRatingChange: gameUserInfo[i * 2].side === "white" ? gameUserInfo[i * 2].ratingChange : gameUserInfo[i * 2 + 1].ratingChange,
            blackRatingChange: gameUserInfo[i * 2].side === "black" ? gameUserInfo[i * 2].ratingChange : gameUserInfo[i * 2 + 1].ratingChange
        });
    }

    return normalizedGameHistory;
}

let getActiveUserService = () => {
    let activeUser = userOnlineCache.getAllUser();

    activeUser = activeUser.map(Element => {
        return { userid: Element.userid, username: Element.username, rating: Element.rating }; // map to reduce the size of return data
    })
    
    return activeUser;
}

module.exports = { getAllUserDataService, getAdminAccountService, putAdminAccountService, deleteAdminAccountService , getAllAdminDataService, getAllGameDataService, getActiveUserService } 