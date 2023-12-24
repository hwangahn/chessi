let activeLobbyCache = (function() {
    let lobbyList = new Array;

    let addLobby = (lobby) => {
        lobbyList.push(lobby);
    }

    let findLobbyBylobbyid = (lobbyid) => {
        return lobbyList.find(Element => Element.lobbyid === lobbyid);
    }

    let checkUserInLobby = (userid) => { // check whether user is in an active game and return gameid
        for (let i = 0; i < lobbyList.length; i++) {
            if (lobbyList[i].isUserInLobby(userid)) {
                return { inLobby: true, lobbyid: lobbyList[i].lobbyid };
            }
        }
        return { inLobby: false, lobbyid: null };
    }

    let filterLobbyTimeout = () => { // remove games that is over off active games
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

    return { addLobby, findLobbyBylobbyid, checkUserInLobby, filterLobbyTimeout }
})();

module.exports = { activeLobbyCache }