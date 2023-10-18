let userOnline = (function() { // wrapper object
    let userOnlineList = new Array();
    let accessTokenLifetime = 24 * 60 * 60 * 1000;

    let findUserByUid = (uid) => {
        return userOnlineList.find(Element => Element.uid === uid);
    };
    
    let addUser = (userObj) => {
        userOnlineList.push(userObj);
    }
    
    let filterUserBySocket = (socketID) => {
        userOnlineList = userOnlineList.filter(Element => Element.socketID !== socketID);
    };
    
    let filterUserByUid = (uid) => {
        userOnlineList = userOnlineList.filter(Element => Element.uid !== uid);
    };
    
    let filterUserBySessionTime = () => {
        userOnlineList = userOnlineList.filter(Element => Date.now() - Element.loginTime <= accessTokenLifetime) // remove users' sessions exceeds access token time limit
    }
    return {findUserByUid, addUser, filterUserBySocket, filterUserByUid, filterUserBySessionTime}
})()

setInterval(userOnline.filterUserBySessionTime, 1000);

module.exports = { userOnline }