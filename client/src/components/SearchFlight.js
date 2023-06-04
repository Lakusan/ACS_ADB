import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";

const SearchFlight = () => {
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  // Fetch airports data from OpenSky Network API
  useEffect(() => {
    fetch('/api/data',
      {
        auth: {
          username: 'ugurcankaya ',
          password: '=e7h@c9@$Tr4Tu=iglje',
        },}
        )
        .then(response => response.json())
      .then((data) => {
        setAirports(data);
      })
      .catch((error) => {
        console.error('Error fetching airports:', error);
      });
  }, []);
//   useEffect(() => {
//     const fetchArrivals = async () => {
//       try {
//         const response = await axios.get(
//           `https://opensky-network.org/api/flights/arrival?airport=${selectedCity}`,
//           {
//             auth: {
//               username: 'ugurcankaya ',
//               password: '=e7h@c9@$Tr4Tu=iglje',
//             },
//           }
//         );
//         setArrivals(response.data);
//       } catch (error) {
//         console.error('Error fetching arrivals:', error);
//       }
//     };

//     fetchArrivals();
//   }, [selectedCity]);

  const handleAirportSelection = (event) => {
    const airportCode = event.target.value;
    const selectedAirport = airports.find((airport) => airport.icao === airportCode);
    setSelectedAirport(selectedAirport);
  };

  const handleNearbySearch = () => {
    // Use browser's geolocation API to get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Send API request to OpenSky Network for flights
        axios
          .get('https://opensky-network.org/api/states/all',
          {
            auth: {
              username: 'ugurcankaya ',
              password: '=e7h@c9@$Tr4Tu=iglje',
            },}, {
            params: {
              lomin: longitude - 2,
              lomax: longitude + 2,
              lamin: latitude - 2,
              lamax: latitude + 2,
            },
          })
          .then((response) => {
            setSearchResult(response.data.states);
          })
          .catch((error) => {
            console.error('Error searching flights:', error);
          });
      },
      (error) => {
        console.error('Error retrieving geolocation:', error);
      }
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); // Adjust the formatting options as needed
  };

  return (
    <div>
          <button onClick={handleNearbySearch} className={"loginBTN"}>Search Nearby</button>
      <br>
      </br>
      <label>
       <h2> Select Airport:</h2>
        <select onChange={handleAirportSelection} className="form-control"
            style={{ width: 200,height: 30 }}>
          <option value="">Select an airport</option>
          {airports.map((airport) => (
            <option key={airport.icao_code} value={airport.icao_code}>
              {airport.city} - {airport.name}
            </option>
          ))}
        </select>
      </label>
      
      

      {selectedAirport && (
        <div>
          <h3>Selected Airport</h3>
          <p>Name: {selectedAirport.name}</p>
          <p>ICAO: {selectedAirport.icao}</p>
        </div>
      )}
    
      {searchResult.length > 0 && (
     <div className="table-container">
        <h3>Search Result</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Flight Number</th>
              <th>Country</th>
              <th>Departure</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
          {searchResult.map((flight) => (
              <tr>
                <td>{flight[0]}</td>
                <td>{flight[1]}</td>
                <td>{flight[2]}</td>
                {/* <td>{flight[4]}</td> */}
                <td>{formatTimestamp(flight[4])}</td>
                <td>{formatTimestamp(flight[3])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       )}

      {/* {searchResult.length > 0 && (
        <div>
          <h3>Search Result</h3>
          <ul>
            {searchResult.map((flight) => (
              <li key={flight[0]}>
                Flight #{flight[0]}: Departure: {flight[2]}, Arrival: {flight[3]}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default SearchFlight;
