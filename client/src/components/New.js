import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import "../components/Style.css";

export function AirportInformation() {
  const [flightData, setFlightData] = useState(null);
  const [departureCities, setDepartureCities] = useState([]);
  const [selectedDepartureCity, setSelectedDepartureCity] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/flights');
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

  const handleDepartureCityChange = (event, { value }) => {
    setSelectedDepartureCity(value);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setSelectedDepartureCity('current');
        },
        (error) => {
          console.error('Error retrieving current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const filterFlightsByLocation = (flights) => {
    if (!currentLocation) {
      return flights;
    }
    const { latitude, longitude } = currentLocation;
    return flights.filter((flight) => {
      const distance = calculateDistance(
        flight.departureLatitude,
        flight.departureLongitude,
        latitude,
        longitude
      );
      return distance <= 100; // Filter flights within 100 km radius
    });
  };

  let filteredFlights = flightData;

  if (flightData && selectedDepartureCity === 'current') {
    filteredFlights = filterFlightsByLocation(flightData);
  } else if (flightData && selectedDepartureCity !== 'current') {
    filteredFlights = flightData.filter(
      (flight) => flight.departureCity === selectedDepartureCity
    );
  }

  const formatTime = (timeString) => {
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  return (
    <div>
      <Dropdown
        placeholder="Select City"
        fluid
        selection
        options={[
          { key: 'current', text: 'Current Location', value: 'current' },
          ...departureCities.map((city) => ({
            key: city,
            text: city,
            value: city,
          })),
        ]}
        value={selectedDepartureCity}
        onChange={handleDepartureCityChange}
      />
      {/* <button onClick={handleCurrentLocation}>Use Current Location</button> */}

      
      {filteredFlights  && (
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
        
        {filteredFlights.map((flight) => (
          
              <tr>
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
        
      )
      }
     
    </div>
  );
}
