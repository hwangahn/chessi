const { user } = require('../models/user');
const { post } = require('../models/post');
const { Op } = require('sequelize')

let searchUserService = async (keyword) => {
    let data = await user.findAll({
        where: { username: { [Op.like]: `%${keyword}%` }},
        attributes: ["userid", "username", "rating"]
    })

    return data;
}

let searchPostService = async (keyword) => {
    let data = await post.findAll({
        where: { post: { [Op.like]: `%${keyword}%` }},
        attributes: ["postid", "authorid", "post", "timestamp"],
        include: {
            model: user,
            attributes: ["username"]
        }
    })



    return data;
}

module.exports = { searchUserService, searchPostService }