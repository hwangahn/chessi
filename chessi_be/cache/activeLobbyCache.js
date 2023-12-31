let activeLobbyCache = (function() {
    let lobbyList = new Array;

    let addLobby = (lobby) => {
        lobbyList.push(lobby);
    }

    let findLobbyBylobbyid = (lobbyid) => {
        return lobbyList.find(Element => Element.lobbyid === lobbyid);
    }

    let filterLobbyBylobbyid = (lobbyid) => {
        lobbyList = lobbyList.filter(Element => Element.lobbyid !== lobbyid);
    }

    let filterUserByuserid = (userid) => { // called when an user logout or lost connection to remove that user from lobby if in
        let { inLobby, lobbyid } = checkUserInLobbyByuserid(userid);

        if (inLobby) {
            userLobby = findLobbyBylobbyid(lobbyid);
            userLobby.filterUserByuserid(userid);
        }
    }

    let filterUserBysocketid = (socketid) => {
        let { inLobby, lobbyid } = checkUserInLobbyBysocketid(socketid);

        if (inLobby) {
            userLobby = findLobbyBylobbyid(lobbyid);
            userLobby.filterUserBysocketid(socketid);
        }
    }

    let checkUserInLobbyByuserid = (userid) => { // check whether user is in an active lobby by userid and return lobbyid
        for (let i = 0; i < lobbyList.length; i++) {
            if (lobbyList[i].isUserInLobbyByuserid(userid)) {
                return { inLobby: true, lobbyid: lobbyList[i].lobbyid };
            }
        }
        return { inLobby: false, lobbyid: null };
    }

    let checkUserInLobbyBysocketid = (socketid) => { // check whether user is in an active lobby by socketid and return lobbyid
        for (let i = 0; i < lobbyList.length; i++) {
            if (lobbyList[i].isUserInLobbyBysocketid(socketid)) {
                return { inLobby: true, lobbyid: lobbyList[i].lobbyid };
            }
        }
        return { inLobby: false, lobbyid: null };
    }

    let filterLobbyTimeout = () => { // remove lobbies that is over 
        let lobbiesTimeout = new Array; 
        lobbyList = lobbyList.filter(Element => {
            let isTimeLeft = Element.isTimeLeft();

            if (!isTimeLeft) {
                lobbiesTimeout.push(Element);
            }
            return isTimeLeft;
        });

        return { lobbiesTimeout: lobbiesTimeout, lobbiesActive: lobbyList };
    }

    let filterLobbyStarted = () => { // remove lobbies that is started. cache manager will notify user in lobby of start
        let lobbiesStarted = new Array; 
        lobbyList = lobbyList.filter(Element => {
            let isStarted = Element.isStarted;

            if (isStarted) {
                lobbiesStarted.push(Element);
            }
            return !isStarted;
        });

        return { lobbiesStarted: lobbiesStarted, lobbiesActive: lobbyList };
    }

    return { addLobby, findLobbyBylobbyid, filterUserByuserid, filterUserBysocketid, filterLobbyBylobbyid, checkUserInLobbyByuserid, filterLobbyTimeout, filterLobbyStarted }
})();

module.exports = { activeLobbyCache }