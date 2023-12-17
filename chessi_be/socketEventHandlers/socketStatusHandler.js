const { matchMakingCache } = require('../cache/matchmakingCache');
const { userOnlineCache } = require('../cache/userOnlineCache');

module.exports = (io) => { 
    let handleConnect = function(socket) {
        console.log(`socket ${socket.id} connected`);
    }

    let handleDisconnect = function(reasons) {
        let socket = this;

        userOnlineCache.filterUserBysocketid(socket.id); // remove user from online list
        matchMakingCache.filterUserBysocketid(socket.id); // remove user from match making queue if in

        console.log(`socket ${socket.id} disconnected because ${reasons}`);
    };
    
    return { handleConnect, handleDisconnect }
}