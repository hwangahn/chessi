const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
require('./models/initDB');

let app = express();
let httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:3000"
    }  
});

let port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: "false"
}));

app.use(express.urlencoded());
app.use(express.json());

app.use('/', require('./APIs/logonAPI'));

io.on("connection", (socket) => {
    console.log(socket.id);
});

httpServer.listen(port, () => {
    console.log(`listening on port ${port}`);
});

