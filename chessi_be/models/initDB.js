const { Sequelize } = require('sequelize');
const { user } = require('./user');
const { email } = require('./email');

let connection = new Sequelize(process.env.DB_KEY);

connection.authenticate()
.then(() => {
    console.log("connected");
})
.catch( err => console.log(err) );

user.hasOne(email, {
    foreignKey: 'uid'
});
email.belongsTo(user, {
    foreignKey: 'uid'
});

user.sync()
.then(() => {
    return email.sync();
})
.catch( err => console.log(err));