// import React from 'react';

// export function AirportFinder() {
//   return (
//     <>
//     <h1> Airport Finder </h1>
//     </>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List } from 'semantic-ui-react';
import axios from 'axios';

const parseAirportData = (data) => {
  
  const lines = data.split('\n');

  const airports = lines.map((line) => {
    const fields = line.split(',');

    if (fields.length === 13) {
      const airport = {
        id: parseInt(fields[0]),
        name: fields[1].replace(/"/g, ''),
        city: fields[2].replace(/"/g, ''),
        country: fields[3].replace(/"/g, ''),
        code: fields[4].replace(/"/g, ''),
        iata: fields[5].replace(/"/g, ''),
        lat: parseFloat(fields[6]),
        lon: parseFloat(fields[7]),
        elevation: parseInt(fields[8]),
        timezone: fields[11].replace(/"/g, ''),
      };

      return airport;
    }

    return null;
  });

  return airports.filter((airport) => airport !== null);
};

export function AirportFinder()  {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [specifiedLocation, setSpecifiedLocation] = useState('');
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [parsedAirportsData, setParsedAirportsData] = useState([]);

  const searchButtonRef = useRef(null); // Creating a ref for the search button

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    const dlat = lat2Rad - lat1Rad;
    const dlon = lon2Rad - lon1Rad;

    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  };

  const fetchNearbyAirports = (parsedAirportsData, location) => {
    const [lat, lon] = location.split(',').map(parseFloat);

    const nearby = parsedAirportsData.filter((airport) => {
      const distance = calculateDistance(lat, lon, airport.lat, airport.lon);
      return distance <= 10000; 
    });

    console.log(nearby);

    setNearbyAirports(nearby);
  };

  const parseLocation = (location) => {
    const [lat, lon] = location.split(',').map(parseFloat);
    return { lat, lon };
  };

  useEffect(() => {
    // Fetch current location or use specified location
    const location = currentLocation || specifiedLocation;
    if (location) {
      // Fetch nearby airports based on the location
      fetchNearbyAirports(parsedAirportsData, location);
    }
  }, [currentLocation, specifiedLocation]);

  useEffect(() => {
    // Fetch airport data from the API endpoint
    axios
      .get('/api/airports')
      .then((response) => {
        const airportsData = response.data;
        const parsedData = parseAirportData(airportsData);
        setParsedAirportsData(parsedData);
      })
      .catch((error) => {
        console.log('Error fetching airport data:', error);
      });
  }, []);

  const handleLocationChange = (event) => {
    setSpecifiedLocation(event.target.value);
  };

  console.log(parsedAirportsData);

  const locationOptions = parsedAirportsData.map((airport) => ({
    key: airport.code,
    text: `${airport.city}, ${airport.country}`,
    value: `${airport.lat},${airport.lon}`,
  }));

  const handleSearch = () => {
    console.log('Parsed Airports Data:', parsedAirportsData);
    console.log('Specified Location:', specifiedLocation);
    fetchNearbyAirports(parsedAirportsData, specifiedLocation);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = `${latitude},${longitude}`;
          console.log('Current Location:', currentLocation);
          setCurrentLocation(currentLocation);
        },
        (error) => {
          console.log(error);
          // Handle error retrieving current location
        }
      );
    } else {
      
      
    }
  };

  return (
    <div>
      <label style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>
        Search nearby airports:
        <Input
          type="text"
          value={specifiedLocation}
          onChange={handleLocationChange}
          placeholder="Enter location"
        />
        <Button primary onClick={handleSearch}>
          Search
        </Button>
      </label>

      <Button primary onClick={handleCurrentLocation}>
        Use Current Location
      </Button>

      <List>
        {nearbyAirports.map((airport) => (
          <List.Item key={airport.id}>
            <List.Content>
              <List.Header>{airport.name}</List.Header>
              <List.Description>{`${airport.city}, ${airport.country}`}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};


