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
        let { inLobby, lobbyid } = checkUserInLobby(userid);

        if (inLobby) {
            userLobby = findLobbyBylobbyid(lobbyid);
            userLobby.filterUserByuserid(userid);
        }
    }

    let checkUserInLobby = (userid) => { // check whether user is in an active lobby and return lobbyid
        for (let i = 0; i < lobbyList.length; i++) {
            if (lobbyList[i].isUserInLobby(userid)) {
                return { inLobby: true, lobbyid: lobbyList[i].lobbyid };
            }
        }
        return { inLobby: false, lobbyid: null };
    }

    let filterLobbyTimeout = () => { // remove lobbies that is over 
        let lobbiesTimeout = new Array; 
        lobbyList = lobbyList.filter(Element => {
            let isTimeout = Element.isTimeout();

            if (isTimeout) {
                lobbiesTimeout.push(Element);
            }
            return !isTimeout;
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

    return { addLobby, findLobbyBylobbyid, filterUserByuserid, filterLobbyBylobbyid, checkUserInLobby, filterLobbyTimeout, filterLobbyStarted }
})();

module.exports = { activeLobbyCache }