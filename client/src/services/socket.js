import { io } from "socket.io-client";


const urlBackend = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

const socket = new io(urlBackend, {
    // transports: ["websocket"],
    autoConnect: true
});

export default socket;