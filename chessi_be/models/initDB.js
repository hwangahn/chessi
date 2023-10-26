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

let connection = new Sequelize(process.env.DB_KEY);

connection.authenticate()
.then(() => {
    console.log("connected");
})
.catch( err => console.log(err) );

user.hasOne(email, {
    foreignKey: 'userid'
});
email.belongsTo(user, {
    foreignKey: 'userid'
});

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

move.belongsTo(game, {
    foreignKey: "gameid"
}); 
game.hasMany(move, {
    foreignKey: "gameid"
});

ratingChange.belongsTo(user, {
    foreignKey: "userid"
});
user.hasMany(ratingChange, {
    foreignKey: "userid"
});

post.belongsTo(user, {
    foreignKey: "authorid"
});
user.hasMany(post, {
    foreignKey: "authorid"
});

comment.belongsTo(post, {
    foreignKey: "postid"
});
post.hasMany(comment, {
    foreignKey: "postid"
});

comment.belongsTo(user, {
    foreignKey: "authorid"
});
user.hasMany(comment, {
    foreignKey: "authorid"
});

transaction.belongsTo(user, {
    foreignKey: "userid"
});
user.hasOne(transaction, {
    foreignKey: "userid"
});

let drop = async () => {
    try {
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
    } catch(err) {
        console.log(err)
    }
}

(async () => {
    try {
        // await drop();

        await create();
        // let res = await user.findAll({ include: { model: gameUser, include: { model: game } } });
        // console.log(res);
    } catch(err) {
        console.log(err);
    }
})();
