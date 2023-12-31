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
        let socket = this;

        let game = activeGameCache.findGameBygameid(roomid); // check game's existence

        if (game) {
            let isMoveMade = game.makeMove(move); // try making move
            // will return null if move cant be made

            if (isMoveMade) { // move ok

                // broadcast to room
                socket.to(roomid).emit("move made", isMoveMade);
                socket.emit("move made", isMoveMade);
            }
        }
    }

    let handleSendMessage = function(roomid, sender, message) {
        let socket = this;

        // broadcast message to room
        socket.to(roomid).emit("chat message", sender, message);
        socket.emit("chat message", sender, message);
    }
    
    return { handleGetRoomInfo, handleMakeMove, handleSendMessage }
}