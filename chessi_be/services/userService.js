const bcrypt = require('bcrypt')
const { user } = require('../models/user')
const { gameUser } = require('../models/gameUser')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')
require('dotenv').config();


let userDataService = async (userId) => {
    //lay data cua user chinh qua id
    let userData = await user.findAll({
        where: {userid: userId},
        attributes: ['userid','username', 'rating'],
    })
    if (!user) {
        throw (new httpError(404,"User not found"))
    }

    return { userData }

}
let gameDataService = async (gameId) => {
    //lay game data tu game id
    let gameData = await gameUser.findOne( {
        where: { gameid: gameId},
    })
    
    if (!gameData) {
        throw(new httpError(404,"Game data not found"))
    }
    //lay 2 user name tu side va game id
    let userJoined = await gameData.findAll( { 
        include: [
            { 
            model:user,
            attributes: ['username']
            }, 
        ],
        where: { 
            gameid: gameId,
            side: ['black','white']
        },
        attributes:['gameid','username','side']
    })
    return {gameData, userJoined}
}

let gameMoveService = async (gameId) => {
    // lay qua game id vs side
    // lay username qua gameid, side va userid

}


module.exports = { userDataService, gameDataService, gameMoveService }