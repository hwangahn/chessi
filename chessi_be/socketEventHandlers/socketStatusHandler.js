let { userOnline } = require("../cache/userOnlineCache");



module.exports = (io) => { 
    let handleDisconnect = function() {
        let socket = this;

        userOnline.filterUserBySocket(socket.id);

        console.log(`socket ${socket.id} disconnected`);
    } 
    
    return { handleDisconnect }
}