import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
    reconnectionDelay: 10000
});

export default socket;
