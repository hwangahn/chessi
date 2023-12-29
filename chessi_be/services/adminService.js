const bcrypt = require('bcrypt')
const { user } = require('../models/user')
const { game } = require('../models/game')
const { httpError } = require('../error/httpError')
const { email } = require('../models/email')


let getAllUserDataService = async () => {
    // get all user id, name, rating from database
    let data = await user.findAll()

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


module.exports = { getAllUserDataService, getAdminAccountService, putAdminAccountService, deleteAdminAccountService , getAllAdminDataService } 