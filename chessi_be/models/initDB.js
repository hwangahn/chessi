const { Sequelize } = require('sequelize');
const { user } = require('./user');
const { email } = require('./email');
const { game } = require('./game');
const { gameUser } = require('./gameUser');
const { move } = require('./move');
const { ratingChange } = require('./ratingChange');
const { post } = require('./post');
const { comment } = require('./comment');
const { transaction } = require('./transaction');
const { userFollow } = require('./userFollow');
const mysql = require('mysql2');
const util = require('util');
const bcrypt = require('bcrypt');

let DB_KEY = process.env.DB_KEY;

let dbName = DB_KEY.split('/')[DB_KEY.split('/').length - 1];
let dbURL = DB_KEY.slice(0, -dbName.length);

let dummyConnection = mysql.createConnection(dbURL); // connect to mysql with the url string
let connection = new Sequelize(DB_KEY);

connection.authenticate()
.then(() => {
    console.log("connected");
})
.catch( err => console.log(err) );

// user - email: 1:1
user.hasOne(email, {
    foreignKey: 'userid'
});
email.belongsTo(user, {
    foreignKey: 'userid'
});
// user - game: M:N through 'gameUser'
user.hasMany(gameUser, {
    foreignKey: "userid"
});
gameUser.belongsTo(user, {
    foreignKey: "userid"
});
game.hasMany(gameUser, {
    foreignKey: "gameid"
});
gameUser.belongsTo(game, {
    foreignKey: "gameid"
});
game.belongsToMany(user, {
    through: gameUser, 
    foreignKey: "gameid"
});
user.belongsToMany(game, {
    through: gameUser, 
    foreignKey: "userid"
});
// game - move: 1:N
move.belongsTo(game, {
    foreignKey: "gameid"
}); 
game.hasMany(move, {
    foreignKey: "gameid"
});
// user - ratingChange: 1:N
ratingChange.belongsTo(user, {
    foreignKey: "userid"
});
user.hasMany(ratingChange, {
    foreignKey: "userid"
});
// user - post: 1:N
post.belongsTo(user, {
    foreignKey: "authorid"
});
user.hasMany(post, {
    foreignKey: "authorid"
});
// post - comment: 1:N
comment.belongsTo(post, {
    foreignKey: "postid"
});
post.hasMany(comment, {
    foreignKey: "postid"
});
// user - comment: 1:N
comment.belongsTo(user, {
    foreignKey: "authorid"
});
user.hasMany(comment, {
    foreignKey: "authorid"
});
// user - transaction: 1:1
transaction.belongsTo(user, {
    foreignKey: "userid"
});
user.hasOne(transaction, {
    foreignKey: "userid"
});
// user - user: M:N through "userFollow" but cannot be eager loaded through "user"
// must be retrieved through "userFollow"
user.hasMany(userFollow, {
    foreignKey: "userid"
});
userFollow.belongsTo(user, {
    foreignKey: "userid"
});
user.hasMany(userFollow, {
    foreignKey: "followerid"
});
userFollow.belongsTo(user, {
    foreignKey: "followerid"
});

let drop = async () => {
    try {
        await userFollow.drop();
        await transaction.drop();
        await comment.drop();
        await post.drop();
        await ratingChange.drop();
        await move.drop();
        await gameUser.drop();
        await email.drop();
        await game.drop();
        await user.drop();
    } catch(err) {
        console.log(err)
    }
}

let create = async () => {
    try {
        await user.sync();
        await game.sync();
        await email.sync();
        await transaction.sync();
        await post.sync();
        await gameUser.sync();
        await move.sync();
        await ratingChange.sync();
        await comment.sync();
        await userFollow.sync();
    } catch(err) {
        console.log(err)
    }
}

(async () => {
    try {
        const query = util.promisify(dummyConnection.query).bind(dummyConnection); // bind all query to a promise
        await util.promisify(dummyConnection.connect).call(dummyConnection); // connect to mysql
        console.log('created dummy connection to MySQL!');

        await query(`CREATE DATABASE IF NOT EXISTS ${dbName}`); // create schema/database
        console.log(`database '${dbName}' created successfully (if it didn't exist already)`);

        await dummyConnection.end();

        // await drop();    
        
        await create();

        let hashedPassword = await bcrypt.hash("Admin123", 10);
        let usersFound = await user.findOne({ where: { username: "admin" }});
        if (!usersFound) {
            let admin = await user.create({
                userid: 0,
                username: "admin",
                password: hashedPassword,
                isAdmin: true,
                rating: -1
            })

            await email.create({
                userid: admin.userid,
                email: "xortaa2003@gmail.com",
                verificationToken: -1,
                verificationStatus: true
            })
        }
    } catch(err) {
        console.log(err);
    }
})();
