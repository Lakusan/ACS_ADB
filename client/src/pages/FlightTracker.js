import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import "./style.css"


export function FlightTracker() {
  const srhLocation = {
    geocode: [49.41386, 8.65164],
    popUp: 'SRH Heidelberg',
  };

  const airport = new Icon({
    iconUrl: require('../resources/airport.png'),
    iconSize: [35, 35],
  });
  const airplane = new Icon({
    iconUrl: require('../resources/airplane.png'),
    iconSize: [35, 35],
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
  const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get( backendURL + '/api/opensky/flights/' + iata);
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
      const response = await fetch( backendURL + `/api/opensky/airportInfo/${iata}`);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  const [departureAirportInfo, setDepartureAirportInfo] = useState(null);
  const [arrivalAirportInfo, setArrivalAirportInfo] = useState(null);

  const latestFlight = data?.data[0];

  useEffect(() => {
    const fetchData = async () => {
      if (latestFlight?.departure?.iata && latestFlight?.arrival?.iata) {
        const departureDataRes = await fetchAirportInfo(latestFlight.departure.iata);
        const arrivalDataRes = await fetchAirportInfo(latestFlight.arrival.iata);
        setDepartureAirportInfo(departureDataRes);
        setArrivalAirportInfo(arrivalDataRes);
      }
    };

    fetchData();
  }, [latestFlight]);

  return (
    <div className="App">
      <div>
        {isLoading ? (
          <p>Fetching Data...</p>
        ) : (
          <>
            <MapContainer
              center={
                latestFlight?.live
                  ? [latestFlight.live.latitude, latestFlight.live.longitude]
                  : srhLocation.geocode
              }
              zoom={4}
              style={{ height: '700px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
              />

              {departureAirportInfo && arrivalAirportInfo ? (
                <>
                  <Marker
                    position={[
                      departureAirportInfo.location.coordinates[1],
                      departureAirportInfo.location.coordinates[0],
                    ]}
                    icon={airport}
                  >
                    <Popup>
                      <h3>
                        Departure: {departureAirportInfo.name} {departureAirportInfo.iata}
                      </h3>
                      <p>
                        <strong>Terminal:</strong> {latestFlight?.departure?.terminal}
                      </p>
                      <p>
                        <strong>Gate:</strong> {latestFlight?.departure?.gate}
                      </p>
                      <p>
                        <strong>Delay:</strong> {latestFlight?.departure?.delay}
                      </p>
                      <p>
                        <strong>Scheduled:</strong> {latestFlight?.departure?.scheduled}
                      </p>
                      <p>
                        <strong>Actual:</strong> {latestFlight?.departure?.actual}
                      </p>
                      <p></p>
                    </Popup>
                  </Marker>

                  <Marker
                    position={[
                      arrivalAirportInfo.location.coordinates[1],
                      arrivalAirportInfo.location.coordinates[0],
                    ]}
                    icon={airport}
                  >
                    <Popup>
                      <h3>
                        Arrival: {arrivalAirportInfo.name} {arrivalAirportInfo.iata}
                      </h3>
                      <p>
                        <strong>Terminal:</strong> {latestFlight?.arrival?.terminal}
                      </p>
                      <p>
                        <strong>Gate:</strong> {latestFlight?.arrival?.gate}
                      </p>
                      <p>
                        <strong>Baggage:</strong> {latestFlight?.arrival?.baggage}
                      </p>
                      <p>
                        <strong>Delay:</strong> {latestFlight?.arrival?.delay}
                      </p>
                      <p>
                        <strong>Scheduled:</strong> {latestFlight?.arrival?.scheduled}
                      </p>
                      <p>
                        <strong>Actual:</strong> {latestFlight?.arrival?.actual}
                      </p>
                      <p>{arrivalAirportInfo.city}</p>
                    </Popup>
                  </Marker>

                  <Polyline
                    positions={[
                      [
                        departureAirportInfo.location.coordinates[1],
                        departureAirportInfo.location.coordinates[0],
                      ],
                      [
                        arrivalAirportInfo.location.coordinates[1],
                        arrivalAirportInfo.location.coordinates[0],
                      ],
                    ]}
                    color="green"
                  >
                  </Polyline>
                </>
              ) : null}

              {latestFlight?.live ? (
                
                <Marker position={[latestFlight.live.latitude, latestFlight.live.longitude]} icon={airplane} >
                  <Popup>
                    <h3>{latestFlight?.airline?.name}</h3>
                    <p>
                      <strong>Flight:</strong> {latestFlight?.flight?.iata}
                    </p>
                    <p>
                      <strong>Altitude:</strong> {latestFlight?.live?.altitude}
                    </p>
                    <p>
                      <strong>Horizontal Speed:</strong> {latestFlight?.live?.speed_horizontal}
                    </p>
                    <p>
                      <strong>Direction:</strong> {latestFlight?.live?.direction}
                    </p>
                    <p>
                      <strong>Vertical Speed:</strong> {latestFlight?.live?.speed_vertical}
                    </p>
                    <p>
                      <strong>Latest Update:</strong> {latestFlight?.live?.updated}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {latestFlight?.live?.latitude}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {latestFlight?.live?.longitude}
                    </p>
                    <p>
                      <strong>On Ground:</strong> { (latestFlight?.departure?.is_ground) ? "Yes" : "No"}

                    </p>



                  </Popup>
                </Marker>
              ) : null}
            </MapContainer>

            <div className="table-container">
  <table className="flight-table">
    <thead>
      <tr>
        <th className="header">Date</th>
        <th className="header">Status</th>
        <th className="header">Airport (Departure)</th>
        <th className="header">Terminal (Departure)</th>
        <th className="header">Gate (Departure)</th>
        <th className="header">Delay (Departure)</th>
        <th className="header">Scheduled (Departure)</th>
        <th className="header">Actual (Departure)</th>
        <th className="header">Estimated Runway (Departure)</th>
        <th className="header">Actual Runway (Departure)</th>
      
      </tr>
    </thead>
    {latestFlight && (
      <tbody>
        <tr>
      
        <td>{latestFlight.flight_date}</td>
          <td>{latestFlight.flight_status}</td>
          <td>{latestFlight.departure.airport}</td>
          <td>{latestFlight.departure.terminal}</td>
          <td>{latestFlight.departure.gate}</td>
          <td>{latestFlight.departure.delay}</td>
          <td>{latestFlight.departure.scheduled}</td>
          <td>{latestFlight.departure.actual}</td>
          <td>{latestFlight.departure.estimated_runway}</td>
          <td>{latestFlight.departure.actual_runway}</td>
        </tr>
      </tbody>
    )}
  </table>
</div>


<div className="table-container">
  <table className="flight-table">
    <thead>
      <tr>
       
        <th className="header">Airport (Arrival)</th>
        <th className="header">Terminal (Arrival)</th>
        <th className="header">Gate (Arrival)</th>
        <th className="header">Baggage (Arrival)</th>
        <th className="header">Delay (Arrival)</th>
        <th className="header">Scheduled (Arrival)</th>
        <th className="header">Estimated (Arrival)</th>
        <th className="header">Actual (Arrival)</th>
        <th className="header">Estimated Runway (Arrival)</th>
        <th className="header">Actual Runway (Arrival)</th>
        <th className="header">Airline Name</th>
      </tr>
    </thead>
    {latestFlight && (
      <tbody>
        <tr>

          <td>{latestFlight.arrival.airport}</td>
          <td>{latestFlight.arrival.terminal}</td>
          <td>{latestFlight.arrival.gate}</td>
          <td>{latestFlight.arrival.baggage}</td>
          <td>{latestFlight.arrival.delay}</td>
          <td>{latestFlight.arrival.scheduled}</td>
          <td>{latestFlight.arrival.estimated}</td>
          <td>{latestFlight.arrival.actual}</td>
          <td>{latestFlight.arrival.estimated_runway}</td>
          <td>{latestFlight.arrival.actual_runway}</td>
          <td>{latestFlight.airline.name}</td>
        </tr>
      </tbody>
    )}
  </table>
</div>



            <h3>Source: {JSON.stringify(data?.source, null, 2)}</h3>

            <pre>Source: {JSON.stringify(data, null, 2)}</pre>
            
          </>
        )}
      </div>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
