import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';

export function FlightTracker() {
  const srhLocation = {
    geocode: [49.41386, 8.65164],
    popUp: 'SRH Heidelberg',
  };

  let { icao24 } = useParams();

  console.log(icao24);

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
      const response = await axios.get('http://localhost:5000/api/opensky/flights/' + icao24);
      setData(response.data);
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

  return (
    <div className="App">
      <div>
        {isLoading ? (
          <p>Fetching Data...</p>
        ) : (
          <>
            <MapContainer
              center={data?.data ? [data.data.latitude, data.data.longitude] : srhLocation.geocode}
              zoom={10}
              style={{ height: '400px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
              />
              {data?.data.latitude && data?.data.longitude ? (
                <Marker position={[data.data.latitude, data.data.longitude]} icon={airPlaneIcon}>
                  <Popup>{data.data.icao24}</Popup>
                </Marker>
              ) : (
                <Marker position={srhLocation.geocode} icon={srhIcon}></Marker>
              )}
            </MapContainer>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
      </div>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
