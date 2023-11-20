let userOnline = (function() { // wrapper object
    let userOnlineList = new Array();
    let accessTokenLifetime = 24 * 60 * 60 * 1000;

    let findUserByuserid = (userid) => {
        return userOnlineList.find(Element => Element.userid === userid);
    };

    let findUserBysocketid = (socketid) => {
        return userOnlineList.find(Element => Element.socketid === socketid);
    };
    
    let addUser = (userObj) => {
        userOnlineList.push(userObj);
    };

    let filterUserBysocketid = (socketid) => {
        userOnlineList = userOnlineList.filter(Element => Element.socketid !== socketid);
    };
    
    let filterUserByuserid = (userid) => {
        userOnlineList = userOnlineList.filter(Element => Element.userid !== userid);
    };
    
    let filterUserBySessionTime = () => {
        userOnlineList = userOnlineList.filter(Element => Date.now() - Element.loginTime <= accessTokenLifetime) // remove users' sessions exceeds access token time limit
    };

    return { findUserByuserid, findUserBysocketid, addUser, filterUserBysocketid, filterUserByuserid, filterUserBySessionTime }
})()

module.exports = { userOnline }

