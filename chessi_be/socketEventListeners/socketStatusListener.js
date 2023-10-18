module.exports = (io, socket) => {
    const { handleDisconnect } = require('../socketEventHandlers/socketStatusHandler')(io);
    
    socket.on('disconnect', handleDisconnect);
}
  
  