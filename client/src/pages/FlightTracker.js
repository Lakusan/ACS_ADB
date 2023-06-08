import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline,Tooltip  } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';

export function FlightTracker() {
  const srhLocation = {
    geocode: [49.41386, 8.65164],
    popUp: 'SRH Heidelberg',
  };

  const airport = new Icon({
    iconUrl: require('../resources/airport.png'),
    iconSize: [35, 35]
  });

  let { iata } = useParams();

  

  const srhIcon = new Icon({
    iconUrl:
      'https://www.srh-hochschule-heidelberg.de/typo3conf/ext/site_srh_edu/Resources/Public/Favicons/apple-touch-icon-hochschule.png',
    iconSize: [38, 38],
  });

  const airPlaneIcon = new Icon({
    iconUrl: require('../resources/airplane.png'),
    iconSize: [38, 38],
  });

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/opensky/flights/' + iata);
      setData(await response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  async function fetchAirportInfo(iata) {
    try {
      const response = await fetch(`http://localhost:5000/api/opensky/airportInfo/${iata}`);
      
      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      // Handle the error appropriately (e.g., show an error message)
    }
  }

  const [departureAirportInfo, setDepartureAirportInfo] = useState(null);
  const [arrivalAirportInfo, setArrivalAirportInfo] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        if (data?.data[0].departure.iata && data?.data[0].arrival.iata) {
        
          const departureDataRes = await fetchAirportInfo(data?.data[0].departure.iata);
          const arrivalDataRes = await fetchAirportInfo(data?.data[0].arrival.iata);
            setDepartureAirportInfo(departureDataRes)
            setArrivalAirportInfo(arrivalDataRes)

          console.log(departureDataRes);
          console.log(arrivalDataRes);
        }
      }
    };
  
    fetchData();
  }, [data]);
  

  return (
    <div className="App">
      <div>
        {isLoading ? (
          <p>Fetching Data...</p>
        ) : (
          <>
        
            <MapContainer
              center={data?.data[0].live ? [data.data[0].live.latitude, data.data[0].live.longitude] : srhLocation.geocode}
              zoom={4}
              style={{ height: '700px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
              />

              







{departureAirportInfo && arrivalAirportInfo ? (
          <>



            <Marker position={[departureAirportInfo.location.coordinates[1], departureAirportInfo.location.coordinates[0]]} icon={airport}>
             <Popup>

              <h3>Departure: {departureAirportInfo.name} {departureAirportInfo.iata}</h3>
              <p>{departureAirportInfo.city}</p>
              <p></p>

             </Popup>
            </Marker>

            <Marker position={[arrivalAirportInfo.location.coordinates[1], arrivalAirportInfo.location.coordinates[0]]} icon={airport}>
            
            <Popup>
            <h3>Arrival: {arrivalAirportInfo.name} {arrivalAirportInfo.iata}</h3>
              <p>{arrivalAirportInfo.city}</p>
   
              </Popup>
             </Marker>
     
             <Polyline positions={[[departureAirportInfo.location.coordinates[1], departureAirportInfo.location.coordinates[0]], [arrivalAirportInfo.location.coordinates[1], arrivalAirportInfo.location.coordinates[0]]]} color="green" >
              <Tooltip>Distance to Departure Airport</Tooltip>
            </Polyline>


          
           






          </>
        ) : null}
          
             
          
            </MapContainer>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
      </div>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
