module.exports = (io, socket) => {
    const { handleGetRoomInfo, handleMakeMove, handleSendMessage, handleSendComment } = require('../socketEventHandlers/socketRoomHandler')(io);

    socket.on("join room", handleGetRoomInfo);
    socket.on("make move", handleMakeMove);
    socket.on("send message", handleSendMessage);
    socket.on("send comment", handleSendComment);
}
  
  