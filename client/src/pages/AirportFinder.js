
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

export function AirportFinder  ()  {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [specifiedLocation, setSpecifiedLocation] = useState('');
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchButtonRef = useRef(null); // To Create a ref for the search button
  const dropdownRef = useRef(null);


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

  const fetchNearbyAirports = (location) => {
    if (!location) {
      return; // Exit the function if location is empty
    }
    const [lat, lon] = location.split(',').map(parseFloat);

    // Fetch airport data from the API endpoint
    axios
      .get('http://localhost:3000/api/airports')
      .then((response) => {
        const airportsData = response.data;
        const selectedCityAirports = airportsData.filter((airport) => airport.city === location);

        const nearby = airportsData.filter((airport) => {
          const distance = calculateDistance(lat, lon, airport.location.coordinates[1], airport.location.coordinates[0]);
          return distance <=100; 
        });

        const mergedAirports = [...selectedCityAirports, ...nearby];

      console.log(mergedAirports);

      setNearbyAirports(mergedAirports);

    
      })
      .catch((error) => {
        console.log('Error fetching airport data:', error);
      });
  };

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/airports')
      .then((response) => {
        const airportsData = response.data;
        const cityNames = [...new Set(airportsData.map((airport) => airport.city))];
        setCities(cityNames);
      })
      .catch((error) => {
        console.log('Error fetching airport data:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch current location or use specified location
    const location = currentLocation || specifiedLocation;
    if (location) {
      // Fetch nearby airports based on the location
      fetchNearbyAirports(location);
    }
  }, [currentLocation, specifiedLocation]);

  const handleLocationChange = (event,data) => {
    setSpecifiedLocation(data.value);
    setDropdownOpen(false);
  };

  const handleSearch = () => {
    console.log('Specified Location:', specifiedLocation);
    if (specifiedLocation) {
      fetchNearbyAirports(specifiedLocation);
    } else {
      fetchNearbyAirports(currentLocation);
    }
    
     if (dropdownRef.current.handleClose) {
      dropdownRef.current.handleClose(); 
    }


    const buttonElement = searchButtonRef.current;

    // Disable the button to prevent multiple clicks
    buttonElement.disabled = true;

    // Enable the button after the operations are done
    buttonElement.disabled = false;
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = `${latitude},${longitude}`;
          console.log('Current Location:', currentLocation);
          setCurrentLocation(currentLocation);
          setSpecifiedLocation('');
        fetchNearbyAirports(currentLocation);
        },
        (error) => {
          console.log(error);
          // Handle error retrieving current location
        }
      );
    } else {
      // Geolocation is not supported by the browser
      // Handle the case where geolocation is not available
    }
  };

  return (
    <div>
      <label style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>
        Search nearby airports:
        <Dropdown
        ref={dropdownRef}
          placeholder="Select location"
          fluid
          search
          selection
          options={cities.map((city) => ({
            key: city,
            text: city,
            value: city,
          }))}
          value={specifiedLocation}
          onChange={handleLocationChange}
          open={dropdownOpen} 
          onOpen={() => setDropdownOpen(true)} 
          onClose={() => setDropdownOpen(false)} 
        />
        <Button primary onClick={handleSearch} ref={searchButtonRef}>
          Search
        </Button>
      </label>

      <Button primary onClick={handleCurrentLocation}>
        Use Current Location
      </Button>

      <List divided relaxed>
        {nearbyAirports.map((airport) => (
          <List.Item key={airport._id}>
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


