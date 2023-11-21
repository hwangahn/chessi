module.exports = (io, socket) => {
    const { handleGetRoomInfo } = require('../socketEventHandlers/socketGameHandler')(io);

    socket.on('get room info', handleDisconnect);
}
  
  