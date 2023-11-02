let userOnline = (function() { // wrapper object
    let userOnlineList = new Array();
    let accessTokenLifetime = 24 * 60 * 60 * 1000;

    let findUserByuserid = (userid) => {
        return userOnlineList.find(Element => Element.userid === userid);
    };
    
    let addUser = (userObj) => {
        userOnlineList.push(userObj);
    }
    
    let filterUserBySocket = (socketID) => {
        userOnlineList = userOnlineList.filter(Element => Element.socketID !== socketID);
    };
    
    let filterUserByuserid = (userid) => {
        userOnlineList = userOnlineList.filter(Element => Element.userid !== userid);
    };
    
    let filterUserBySessionTime = () => {
        userOnlineList = userOnlineList.filter(Element => Date.now() - Element.loginTime <= accessTokenLifetime) // remove users' sessions exceeds access token time limit
    }
    return { findUserByuserid, addUser, filterUserBySocket, filterUserByuserid, filterUserBySessionTime }
})()

module.exports = { userOnline }

