import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const FRDataFetcher = () => {
  const [data, setData] = useState(null);
  const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;
  const socket = io(backendURL);

  useEffect(() => {
    // 
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('data', (receivedData) => {
      setData(receivedData);
    });

    // disconnect socket
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {data && <p>{data}</p>}
      {!data && <p>Loading...</p>}
    </div>
  );
};

export default FRDataFetcher;