const { userOnline } = require("../cache/userOnlineCache");
const { matchMakingCache } = require('../cache/matchmakingCache');

module.exports = (io) => { 
    let handleConnect = function(socket) {
        console.log(`socket ${socket.id} connected`);
    }

    let handleDisconnect = function(reasons) {
        let socket = this;

        userOnline.filterUserBysocketid(socket.id); // remove user from online list
        matchMakingCache.filterUserBysocketid(socket.id); // remove user from match making queue if in

        console.log(`socket ${socket.id} disconnected because ${reasons}`);
    };
    
    return { handleConnect, handleDisconnect }
}