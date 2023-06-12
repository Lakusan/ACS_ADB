import React, { useState } from 'react';
import axios from 'axios';
import './FlightFinder.css';

export function FlightFinder() {
  const [flightDetails, setFlightDetails] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;

  async function fetchFlightDetails() {
    try {
      const response = await axios.post(`${backendURL}/api/flights/search`, {
        departureAirport: source,
        arrivalAirport: destination,
        date: date
      });
      setFlightDetails(response.data);
    } catch (error) {
      console.error('Error fetching flight details:', error);
    }
  }

  function calculateDuration(departureTime, arrivalTime) {
    const start = new Date(departureTime);
    const end = new Date(arrivalTime);
    const durationInMs = end - start;
    const durationInHours = durationInMs / (1000 * 60 * 60);
    return durationInHours.toFixed(2);
  }

  function formatTime(time) {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function renderFlightDetails() {
    if (flightDetails.length === 0) {
      if (source === "" || destination === "" || date === "") {
        return null;
      } else {
        return <p className="no-flights">No flights found.</p>;
      }
    } else {
      return (
        <table className="flight-table">
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight Number</th>
              <th>Departure City</th>
              <th>Arrival City</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {flightDetails.map((flight, index) => (
              <tr key={index}>
                <td>{flight.airline}</td>
                <td>{flight.flightNumber}</td>
                <td>{flight.departureCity}</td>
                <td>{flight.arrivalCity}</td>
                <td>{formatTime(flight.departureTime)}</td>
                <td>{formatTime(flight.arrivalTime)}</td>
                <td>{calculateDuration(flight.departureTime, flight.arrivalTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  return (
    <div className="flight-finder">
      <h1 className="title">Flight Finder</h1>

      <form onSubmit={(e) => {
        e.preventDefault();
        fetchFlightDetails();
      }}>
        <label htmlFor="source">From:</label>
        <input type="text" id="source" value={source} onChange={(e) => setSource(e.target.value)} required /><br /><br />

        <label htmlFor="destination">To:</label>
        <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required /><br /><br />

        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required /><br /><br />

        <input type="submit" value="Search" className="submit-button" />
      </form>

      <div className="flight-details">
        {renderFlightDetails()}
      </div>
    </div>
  );
}
