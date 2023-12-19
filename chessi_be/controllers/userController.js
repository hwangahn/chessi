const { userDataService, gameDataService, gameMoveService} = require('../services/userService')
const { checkHttpError } = require('../utils/checkError')

let takeUserData = async (req, res) => {
    try {
        let { userId } = req.body

        let { userData } = await userDataService(userId);

        res.status(200).json({ status: "ok", msg: ""})
    } catch(err) {
        console.log(err);
        if (checkHttpError(err)) {
            res.status(err.getHttpCode()).json({ status: "error", msg: ""})
        }
    }
}

let takeGameData = async (req, res) => {
    try {
        let { gameId } = req.body

        await gameDataService(gameId);
        await gameMoveService(gameId);
        res.status(200).json( { status: "ok", msg: ""} )
    } catch(err) {
        console.log(err);
        res.status(err.getHttpCode()).json({status: "error", msg: ""})
    }
}


module.exports = { takeUserData, takeGameData }