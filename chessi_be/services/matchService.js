const { user } = require('../models/user');
const { gameUser } = require('../models/gameUser');
const { game } = require('../models/game');
const { matchmakingCache } = require('../cache/matchmakingCache');

let findMatchService = async ( userid ) => {
    let usersFound = await user.findOne({ 
        where: { userid: userid }, 
        attributes: ["rating"],
        limit: 5, 
        include: { 
            model: gameUser, 
            include: {
                model: game, 
                order: [[ "timestamp", "DESC" ]],
            }
        }
    });

    
}

module.exports = { findMatchService }