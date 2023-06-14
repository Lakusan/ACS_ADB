
import React, { useState, useEffect, useRef } from 'react';
import { Button, List, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

// author Harshitha

export function AirportFinder  ()  {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [specifiedLocation, setSpecifiedLocation] = useState('');
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchButtonRef = useRef(null); 
  const dropdownRef = useRef(null);


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 

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
    const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;
    if (!location) {
      return; 
    }
    const [lat, lon] = location.split(',').map(parseFloat);

    axios
      .get(`${backendURL}/api/airports`)
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
    const backendURL = process.env.REACT_APP_SERVER_HOSTNAME + ":" + process.env.REACT_APP_SERVER_PORT;
    axios
      .get(`${backendURL}/api/airports`)
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
    const location = currentLocation || specifiedLocation;
    if (location) {
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

    buttonElement.disabled = true;

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
        }
      );
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


