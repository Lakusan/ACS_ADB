import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';
import { LatLng } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export function RoutePlanner() {
  // Icons
  const pointA = new Icon({
    iconUrl: require('../resources/pointA.png'),
    iconSize: [35, 35]
  });

  const pointB = new Icon({
    iconUrl: require('../resources/pointB.png'),
    iconSize: [35, 35]
  });

  const airport = new Icon({
    iconUrl: require('../resources/airport.png'),
    iconSize: [35, 35]
  });

  // Markers
  const [positionA, setPositionA] = useState([50.0380, 8.5622]);
  const [positionB, setPositionB] =  useState([41.2768, 28.7300]);

  const markerRefA = useRef(null);
  const markerRefB = useRef(null);

  useEffect(() => {
    const markerA = markerRefA.current;
    const markerB = markerRefB.current;

    if (markerA && markerB) {
      const latLngs = [markerA.getLatLng(), markerB.getLatLng()];
    }
  }, [positionA, positionB]);

  const eventHandlersA = useMemo(
    () => ({
      dragend() {
        const marker = markerRefA.current;
        if (marker) {
          setPositionA(marker.getLatLng());
        }
      },
    }),
    []
  );

  const eventHandlersB = useMemo(
    () => ({
      dragend() {
        const marker = markerRefB.current;
        if (marker) {
          setPositionB(marker.getLatLng());
        }
      },
    }),
    []
  );


  const handleReset = () => {
    window.location.reload();
  };

  function latLngToArray(latLng) {
    var array = [latLng.lat, latLng.lng];
    return array;
  }

  const [loading, setLoading] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [departureAirportLocation, setDepartureAirportLocation] = useState([]);
  const [destinationAirportLocation, setDestinationAirportLocation] = useState([]);
  const [departureInfo, setDepartureInfo] = useState(null);
  const [destinationInfo, setDestinationInfo] = useState(null);

  const [routeInfo, setRouteInfo] = useState(null);
  const handleCreate = () => {
    setLoading(true);
    setRouteFound(false);

    const originPoint = latLngToArray(positionA);
    const arrivalPoint = latLngToArray(positionB);
    const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

    axios
      .get(`${backendURL}/api/route/${originPoint[0]}/${originPoint[1]}/${arrivalPoint[0]}/${arrivalPoint[1]}`)
      .then(res => {
        if (res.data?.origin?.properties?.name && res.data?.destination?.properties?.name) {
          setDepartureAirportLocation(new LatLng(res.data.origin.properties.location.y, res.data.origin.properties.location.x));
          setDestinationAirportLocation(new LatLng(res.data.destination.properties.location.y, res.data.destination.properties.location.x));
          
          setDepartureInfo(res.data.origin.properties);
          setDestinationInfo(res.data.destination.properties);

          console.log(departureInfo, destinationInfo)
          setRouteFound(true);
          console.log('Route found', res.data);


          setRouteInfo(res.data);
       


        } else {
          console.log('No route found', res.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log('Departure Airport Location:', departureAirportLocation);
    console.log('Destination Airport Location:', destinationAirportLocation);
  }, [departureAirportLocation, destinationAirportLocation]);

  return (
    <>
      <h1>Route Planner</h1>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleCreate}>Create Route</button>


    

      
    {routeInfo ? (
          <>

          <h2>Route Information</h2>
          <p><strong>From:</strong> {routeInfo.origin.properties.name} - {routeInfo.origin.properties.icao}  </p>
          <p><strong>To:</strong> {routeInfo.destination.properties.name} - {routeInfo.destination.properties.icao}</p>

          <p><strong>City:</strong> {routeInfo.origin.properties.city} to {routeInfo.destination.properties.city}  </p>

          <p><strong>Distance:</strong> { Math.round(routeInfo.kmDistance)} km</p>
          <p><strong>A320 Neo Estimated Flight Time:</strong> {routeInfo.hours} hours { Math.round(routeInfo.minutes)} minutes</p>
          <p><strong>A320 Neo Estimated Fuel Consumption:</strong> { Math.round(routeInfo.fuelConsumption)}l</p>
          <p><strong>A320 Neo Estimated Fuel Cost:</strong> { Math.round(routeInfo.fuelCost)} Euro</p>
          <p>{routeInfo.flightStatus}</p>


          
          

          </>
        ) : null}


      <MapContainer center={[45.7489, 21.2087]} zoom={5} style={{ height: '600px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors" />

        {!loading && !routeFound ? (
          <>
            <Marker draggable={true} eventHandlers={eventHandlersA} position={positionA} ref={markerRefA} icon={pointA}>
              <Popup>{positionA.toString()}</Popup>
            </Marker>

            <Marker draggable={true} eventHandlers={eventHandlersB} position={positionB} ref={markerRefB} icon={pointB}>
              <Popup>{positionB.toString()}</Popup>
            </Marker>
          </>
        ) : null}

        {routeFound && departureInfo ? (
          <>

<Marker draggable={false} eventHandlers={eventHandlersA} position={positionA} ref={markerRefA} icon={pointA}>
              <Popup>{positionA.toString()}</Popup>
            </Marker>

            <Marker draggable={false} eventHandlers={eventHandlersB} position={positionB} ref={markerRefB} icon={pointB}>
              <Popup>{positionB.toString()}</Popup>
            </Marker>


            <Marker position={departureAirportLocation} icon={airport}>
              <Popup>Departure:{departureInfo.name}</Popup>
            </Marker>
            <Marker position={destinationAirportLocation} icon={airport}>
              <Popup>Destination:{destinationInfo.name}</Popup>
            </Marker>


          
            <Polyline positions={[positionA, departureAirportLocation]} color="green" >
              <Tooltip>Distance to Departure Airport: { Math.round(positionA.distanceTo(departureAirportLocation))/1000} km</Tooltip>
            </Polyline>
            <Polyline positions={[positionB, destinationAirportLocation]} color="green">
              <Tooltip>Distance to Departure Airport: {Math.round(positionB.distanceTo(destinationAirportLocation)/1000)} km</Tooltip>
            </Polyline>


            <Polyline positions={[departureAirportLocation, destinationAirportLocation]} color="red" >
               <Tooltip>Route Distance: {Math.round(routeInfo.kmDistance)} km</Tooltip>


            </Polyline>




          </>
        ) : null}
      </MapContainer>


    </>
  );
}
