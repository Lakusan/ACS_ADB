// import React from 'react';

// export function FlightRadar() {
//   return (
//     <>
//     <h1> FlightRadar Andreas </h1>
//     </>
//   );
// }



import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import React, { Component } from 'react'
import { Icon } from "leaflet";
import FRDataFetcher from '../components/FRDataFetcher';


export function FlightRadar() {



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
        // markers.map((marker) => {
        //   <Marker position={marker.geocode} icon={srhIcon}>
        //     <Popup>
        //       BLA
        //     </Popup>
        //   </Marker>
        // })
        <Marker position={srhLocation.geocode} icon={srhIcon}>
          <Popup>
            {srhLocation.popUp}
          </Popup>
        </Marker>
      }
    </MapContainer>
    <FRDataFetcher></FRDataFetcher>
    </div>
  );
}