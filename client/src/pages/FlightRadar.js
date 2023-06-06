import React, { useEffect, useState } from 'react';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";
// import FRDataFetcher from '../components/FRDataFetcher';
// import useSocketSetup from '../services/useSocketSetup';
import axios from 'axios';
// import socket from '../services/socket';
import { io } from "socket.io-client";
//TODO: connect to socket on backen and retrieve data stream
// parse data and spawn markers

export function FlightRadar() {
  // trigger subscription
  axios.get('http://localhost:3000/api/flights/radar/subscribe');
  // useSocketSetup();

  const urlBackend = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

  const socket = new io(urlBackend, {
    // transports: ["websocket"],
    autoConnect: true
  });
  const [receivedData, setReceivedData] = useState('');
  socket.on('connect', () => {
          socket.on('send_message', (data) => {
            // console.log(data);

            setReceivedData(data);
            console.log(JSON.parse(data));
          });
        });

  
    useEffect(() => {
      // socket.on('connect', () => {
      //   socket.on('send_message', (data) => {
      //     console.log(data);

      //     setReceivedData(data);
      //   });
      // });
      // socket.on('connect_error', () => {
      //   console.error("Socket connection error");
      // });
      // return () => {
      //   socket.off("connect_error");
      // }
      console.log("data");
    }, [receivedData]);

  return (
    <div>
      <h1>Flight Radar</h1>
      <MapComponent />
    </div>
  );
}

export function MapComponent() {
  const srhLocation =
  {
    geocode: [49.41386, 8.65164],
    popUp: "SRH Heidelberg"
  };

  const srhIcon = new Icon({
    iconUrl: 'https://www.srh-hochschule-heidelberg.de/typo3conf/ext/site_srh_edu/Resources/Public/Favicons/apple-touch-icon-hochschule.png',
    iconSize: [38, 38]
  });

  const airplaneIcon = new Icon({
    iconUrl: require('../resources/icon-airplane.png'),
    iconSize: [48, 48]
  })

  return (
    <div className='App'>
      <MapContainer center={[49.41386, 8.65164]} zoom={13} style={{ height: '400px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        {
          markers.map((marker) => {
            <Marker position={marker.geocode} icon={srhIcon}>
              <Popup>
                BLA
              </Popup>
            </Marker>
          })
          
     
        }
             <Marker position={srhLocation.geocode} icon={srhIcon}>
            <Popup>
              {srhLocation.popUp}
            </Popup>
          </Marker>
      </MapContainer>
    </div>
  );
}