module.exports = (io, socket) => {
    const { handleGetRoomInfo, handleMakeMove, handleSendMessage } = require('../socketEventHandlers/socketRoomHandler')(io);

    socket.on("join room", handleGetRoomInfo);
    socket.on("make move", handleMakeMove);
    socket.on("send message", handleSendMessage);
}
  
  