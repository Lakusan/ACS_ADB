import React, { useState, useEffect} from 'react';
import axios from 'axios';

export function FlightFinder() {
  const [flightDetails, setFlightDetails] = useState([]);

  useEffect(() => {
    fetchAllFlightDetails();
  }, []);

  async function fetchFlightDetails(departureAirport, arrivalAirport) {
    try {
      const response = await axios.post('http://localhost:3000/api/flights/Search', {departureAirport, arrivalAirport});
      setFlightDetails(response.data);
    } catch (error) {
      console.error('Error fetching flight details:', error);
    }
  }

  async function fetchAllFlightDetails() {
    try {
      const response = await axios.get('http://localhost:3000/api/flights');
      setFlightDetails(response.data);
    } catch (error) {
      console.error('Error fetching flight details:', error);
    }
  }

  return (
    <div>
      <h1>Flight Status Tracker</h1>

      <form onSubmit={(e) => {
        e.preventDefault();
        const departureAirport = e.target.elements.departureAirport.value;
        const arrivalAirport = e.target.elements.arrivalAirport.value;
        fetchFlightDetails(departureAirport, arrivalAirport);
      }}>

        <label htmlFor="departureAirport">Departure Airport:</label>
        <input type="text" id="departureAirport" name="departureAirport" required /><br /><br />

        <label htmlFor="arrivalAirport">Arrival Airport:</label>
        <input type="text" id="arrivalAirport" name="arrivalAirport" required /><br /><br />

        <input type="submit" value="Search" />
      </form>

      <button onClick={fetchAllFlightDetails}>Load Flight Details</button>

      <div id="flightDetails">
        {flightDetails.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          flightDetails.map((flight, index) => (
            <p key={index}>
              Flight number: {flight.flightNumber}, Departure time: {flight.departureTime}, Arrival time: {flight.arrivalTime}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
