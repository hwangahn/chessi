const { user } = require('../models/user');
const { gameUser } = require('../models/gameUser');
const { game } = require('../models/game');
const { matchMakingCache } = require('../cache/matchmakingCache');
const { userOnline } = require('../cache/userOnlineCache');

let findMatchService = async ( userid ) => {
    let userFound = await user.findOne({ // find user info
        where: { userid: userid }, 
        attributes: ["userid", "rating"],
        limit: 5, 
        include: { 
            model: gameUser, 
            include: {
                model: game, 
                order: [[ "timestamp", "DESC" ]],
            }
        }
    });

    // add user to match making queue
    let normalizedUser = { userid: userFound.userid, socketid: userOnline.findUserByuserid(userid).socketid, rating: userFound.rating, sideHistory: userFound.gameUsers.map(Element =>  Element.side), priority: 0 }
    
    console.log(`user ${userFound.userid} finding match`);

    matchMakingCache.addUser(normalizedUser);
}

let stopFindMatchService = async ( userid ) => {
    matchMakingCache.filterUserByuserid(userid); // remode user from match making queue

    console.log(`user ${userid} stopped finding match`);
}

module.exports = { findMatchService, stopFindMatchService }