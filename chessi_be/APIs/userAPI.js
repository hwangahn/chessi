const express = require('express')
const { takeUserData, takeGameData } = require('../controllers/userController')

let router = express.router();

router.post('/api/userData',takeUserData)
router.post('/api/gameData',takeGameData)

module.exports = router;