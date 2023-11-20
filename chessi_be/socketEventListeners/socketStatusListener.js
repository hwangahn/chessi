module.exports = (io, socket) => {
    const { handleConnect, handleDisconnect } = require('../socketEventHandlers/socketStatusHandler')(io);

    handleConnect(socket);

    socket.on('disconnect', handleDisconnect);
}
  
  