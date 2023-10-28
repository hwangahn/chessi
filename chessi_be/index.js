const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
require('./models/initDB');
require('./cache/startCache');

let app = express();
let server = createServer(app);
const io = new Server(server, { 
    cors: {
        origin: process.env.CLIENT_URL
    }  
});

let port = process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: "false"
}));

app.use(express.urlencoded());
app.use(express.json());

app.use('/', require('./APIs/logonAPI'));

io.on("connection", (socket) => {
    require('./socketEventListeners/socketStatusListener')(io, socket);
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

