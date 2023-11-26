module.exports = (io, socket) => {
    const { handleGetRoomInfo } = require('../socketEventHandlers/socketGameHandler')(io);

    socket.on('join room', handleGetRoomInfo);
}
  
  