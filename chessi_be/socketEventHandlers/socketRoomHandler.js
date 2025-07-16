const { activeGameCache } = require('../cache/activeGameCache');

module.exports = (io) => { 
    let handleGetRoomInfo = function (roomid) {
        let socket = this;

        // socket.rooms indicates rooms user joined
        // by default it is a set
        // transform room set to room array
        let allRoom = Array.from(socket.rooms); 

        allRoom.forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);  // leave all rooms except the default room (socket.id)
            }
        });

        socket.join(roomid); // join room
        
        console.log(`socket ${socket.id} joined room ${roomid}`);
    } 

    let handleMakeMove = function(roomid, move) {
        let game = activeGameCache.findGameBygameid(roomid); // check game's existence

        if (game) {
            game.makeMove(move); // try making move
        }
    }

    let handleSendMessage = function(roomid, sender, message) {
        let socket = this;

        // broadcast message to room
        socket.to(roomid).emit("chat message", sender, message);
        socket.emit("chat message", sender, message);
    }

    let handleSendComment = function(roomid, cmt) {
        let socket = this;

        // broadcast comment to room
        socket.to(roomid).emit("comment sent", cmt);
        socket.emit("comment sent", cmt);
    }
    
    return { handleGetRoomInfo, handleMakeMove, handleSendMessage, handleSendComment }
}