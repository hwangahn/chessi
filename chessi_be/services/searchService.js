const { user } = require('../models/user');
const { post } = require('../models/post');
const { literal } = require('sequelize')

let searchUserService = async (keyword) => {
    let data = await user.findAll({
        // take the string inside the function and paste it directly in the where statement in the query
        where: literal(`LOWER(username) = '${keyword}'`), 
        attributes: ["userid", "username", "rating"]
    })

    return data;
}

let searchPostService = async (keyword) => {
    let data = await user.findAll({
        
    })
}

module.exports = { searchUserService, searchPostService }