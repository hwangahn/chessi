const express = require('express')
const { handleGetUserData } = require('../controllers/userController')

let router = express.Router();

router.get('/api/user/:userid', handleGetUserData);

module.exports = router;