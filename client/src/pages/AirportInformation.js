import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import "../components/Style.css";



export function AirportInformation() {
  const [flightData, setFlightData] = useState(null);
  const [departureCities, setDepartureCities] = useState([]);
  const [selectedDepartureCity, setSelectedDepartureCity] = useState('');


  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/flightsinfo');
        const { data } = response;
        setFlightData(data);
        const cities = [...new Set(data.map((flight) => flight.dep_airport.name))];
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



  let filteredFlights = flightData;

  if (flightData && selectedDepartureCity !== '') {
    filteredFlights = flightData.filter(
      (flight) => flight.dep_airport.name === selectedDepartureCity
    );
  }



  const dropdownOptions = [
    { key: '', text: 'All', value: '' },
    ...departureCities.map((city) => ({
      key: city,
      text: city,
      value: city,
    })),

  ];


  return (
    <div>
      <label style={{ fontSize: '20px', fontWeight: 'bold', color: 'black'}}>Find Departure/Arrival Flights:</label>
      <br/>
      <br/>
      <Dropdown
        placeholder="Select Airport"
        fluid
        search
        selection
        options={dropdownOptions}
        value={selectedDepartureCity}
        onChange={handleDepartureCityChange}
      />

      {filteredFlights && (
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Airline</th>
                <th>Departure City</th>
                <th>Arrival City</th>
                <th>Departing Time</th>
                <th>Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map((flight) => (
                <tr key={flight.flight.id}>
                  <td>{flight.airline.name}</td>
                  <td>{flight.dep_airport.city}</td>
                  <td>{flight.arr_airport.city}</td>
                  <td>{flight.flight.dep_scheduled}    "{flight.dep_airport.timezone_abbr}"</td>
                  <td>{flight.flight.arr_scheduled}     "{flight.arr_airport.timezone_abbr}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

