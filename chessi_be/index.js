const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { socketInstance } = require('./socketInstance');
require('dotenv').config();
require('./models/initDB');
require('./cache/startCache');

let app = express();
let server = createServer(app);
socketInstance.set(new Server(server, { 
    cors: {
        origin: process.env.CLIENT_URL
    }
}));

let port = process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: "false"
}));

app.use(express.urlencoded());
app.use(express.json());

app.use('/', require('./APIs/logonAPI'));
app.use('/', require('./APIs/gameAPI'));
app.use('/', require('./APIs/adminAPI'));
app.use('/', require('./APIs/userAPI'));
app.use('/', require('./APIs/lobbyAPI'));
app.use('/', require('./APIs/searchAPI'));
app.use('/', require('./APIs/postAPI'));

socketInstance.get().on("connection", (socket) => {
    require('./socketEventListeners/socketStatusListener')(socketInstance.get(), socket);
    require('./socketEventListeners/socketRoomListener')(socketInstance.get(), socket);
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});


