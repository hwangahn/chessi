let { userOnline } = require("../cache/userOnlineCache");

module.exports = (io) => { 
    let handleConnect = function(socket) {
        console.log(`socket ${socket.id} connected`);
    }

    let handleDisconnect = function(reasons) {
        let socket = this;

        userOnline.filterUserBysocketid(socket.id); // remove user from online list

        console.log(`socket ${socket.id} disconnected because ${reasons}`);
    };
    
    return { handleConnect, handleDisconnect }
}