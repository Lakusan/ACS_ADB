import { useEffect, useState } from "react";
import socket from './socket';
import axios from 'axios';

const useSocketSetup = () => {
    const [receivedData, setReceivedData] = useState('');
    const urlBackend = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;
    useEffect(() => {
        socket.on('connect', () => {
            socket.on('send_message', (data) => {
                console.log(data);
                setReceivedData(data);
            });
        });
        socket.on('connect_error', () => {
            console.error("Socket connection error");
        });
        return () => {
            socket.off("connect_error");
        }
    });
}



export default useSocketSetup;