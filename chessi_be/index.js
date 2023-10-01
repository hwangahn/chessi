const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models/initDB');

let app = express();
let port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: "false"
}));

app.use(express.urlencoded());
app.use(express.json());

app.use('/', require('./APIs/logonAPI'));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

