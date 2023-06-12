//Monisha
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../components/Style.css';
import { Icon } from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
// });

export function AirportInformation() {
  const [flightData, setFlightData] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [selectedDepartureCity, setSelectedDepartureCity] = useState('');
  const [selectedCityCoordinates, setSelectedCityCoordinates] = useState(null);
  const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/flights`);
        const { data } = response;
        setFlightData(data);
        const cities = [...new Set(data.map((flight) => flight.departureCity))];
        setDepartureCities(cities);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchFlightData();
  }, []);

  useEffect(() => {
    const fetchCityCoordinates = async (city) => {
      try {
        // API call to fetch city coordinates
        const coordinates = {
          'San Francisco': [37.7749, -122.4194],
        'New York': [40.7128, -74.0060],
        'London': [51.5074, -0.1278],
        'Paris': [48.8566, 2.3522],
        'Sydney': [-33.8651, 151.2093],
        };
        setSelectedCityCoordinates(coordinates[city]);
      } catch (error) {
        console.error('Error fetching city coordinates:', error);
      }
    };

    const selectedCity = flightData.find((flight) => flight.departureCity === selectedDepartureCity);
    if (selectedCity) {
      fetchCityCoordinates(selectedCity.departureCity);
    }
  }, [flightData, selectedDepartureCity]);

  const handleDepartureCityChange = (event, { value }) => {
    setSelectedDepartureCity(value);
  };

  const formatTime = (timeString) => {
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  const airplaneIcon = new Icon({
    iconUrl: require('../resources/icon-airplane.png'),
    iconSize: [50, 50]
  })

  return (
    <div>
      <Dropdown
        placeholder="Select City"
        fluid
        selection
        options={departureCities.map((city) => ({
          key: city,
          text: city,
          value: city,
        }))}
        value={selectedDepartureCity}
        onChange={handleDepartureCityChange}
      />

      <div style={{ height: '400px', marginTop: '120px' }}>
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="Map data &copy; OpenStreetMap contributors"
          />
          {selectedCityCoordinates && (
            <Marker position={selectedCityCoordinates} icon={airplaneIcon}></Marker>
          )}
        </MapContainer>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight Number</th>
              <th>Departure City</th>
              <th>Arrival City</th>
              <th>D Time</th>
              <th>A Time</th>
              <th>Gate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {flightData
              .filter((flight) => flight.departureCity === selectedDepartureCity)
              .map((flight) => (
                <tr key={flight.flightNumber}>
                  <td>{flight.airline}</td>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.departureCity}</td>
                  <td>{flight.arrivalCity}</td>
                  <td>{formatTime(flight.departureTime)}</td>
                  <td>{formatTime(flight.arrivalTime)}</td>
                  <td>{flight.gate}</td>
                  <td>{flight.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
