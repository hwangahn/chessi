let userOnlineCache = (function() { // wrapper object
    let userOnlineList = new Array();

    let findUserByuserid = (userid) => {
        return userOnlineList.find(Element => Element.userid == userid);
    };

    let findUserBysocketid = (socketid) => {
        return userOnlineList.find(Element => Element.socketid == socketid);
    };
    
    let addUser = (userObj) => {
        userOnlineList.push(userObj);
    };

    let getAllUser = () => {
        return userOnlineList;
    }

    let filterUserBysocketid = (socketid) => {
        userOnlineList = userOnlineList.filter(Element => Element.socketid != socketid);
    };
    
    let filterUserByuserid = (userid) => {
        userOnlineList = userOnlineList.filter(Element => Element.userid != userid);
    };
    
    let filterUserBySessionTime = () => {
        let userOutOfSession = new Array; 

        userOnlineList = userOnlineList.filter(Element => { 
            let isStillInSession = Element.isStillInSession();

            if (!isStillInSession) {
                userOutOfSession.push(Element);
            }
            
            return isStillInSession;
        }) // remove users' sessions exceeds access token time limit

        return { userOutOfSession, userOnlineList };
    };

    return { findUserByuserid, findUserBysocketid, addUser, getAllUser, filterUserBysocketid, filterUserByuserid, filterUserBySessionTime }
})()

module.exports = { userOnlineCache }

