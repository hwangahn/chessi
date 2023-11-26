module.exports = (io) => { 
    let handleGetRoomInfo = function (roomid) {
        let socket = this;

        socket.join(roomid); // join game room

        console.log(`socket ${socket.id} joined room ${roomid}`);
    } 
    
    return { handleGetRoomInfo }
}