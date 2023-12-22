const bcrypt = require('bcrypt')
const { user } = require('../models/user')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')

let getAllUserDataService = async () => {
    // get all user id, name, rating from database
    let data = await user.findAll({
        attributes: ['userid', 'username', 'rating']
    })

    return {data}
}

let getAdminAccountService = async (userid) => {

    // get admin name
    let data = await user.findOne({
        where: { userid: userid },
        attributes: ['username','isadmin']
    })

    if(!data) {
        throw (new httpError(404,"Cannot find admin"))
    }

    return {data}

}

let putAdminAccountService = async (username, password) => {
    let usersFound = await user.findOne({ where: { username: username }});

    if (usersFound) {
        throw (new httpError(403, "Username and/or email already used"));
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
        userid: 0,
        username: username,
        password: hashedPassword,
        isAdmin: true,
        rating: -1
    });

    console.log("new admin added");
}

let deleteAdminAccountService = async (userid) => {

    let usersFound = await user.findOne({ where: { userid: userid }});

    if (!usersFound) {
        throw (new httpError(403, "Cannot find admin"));
    }

    await User.destroy({
        where: {
          userid: userid
        }
      });
      console.log("admin deleted")
}

let getAllAdminDataService = async () => {
    let data = await user.findAll({
        where: {
            isAdmin: 1
        },
        attributes: ['userid', 'username', 'rating']
    })

    return {data}
}


// let getAllGameDataService = async () => {
//     // get all game data in database
//     let data = await game.findAll({
//         attributes: ['gameid',
//                      'reason',
//                      'timestamp',
//                      'finalfen'
//                                 ]
//     })

//     return {data}
// }


module.exports = { getAllUserDataService , getAllGameDataService, getAdminAccountService, putAdminAccountService, deleteAdminAccountService , getAllAdminDataService } 