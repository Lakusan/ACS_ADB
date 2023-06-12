import React, { useEffect } from 'react';
import L from 'leaflet';

function MapComponent({ data }) {
  useEffect(() => {
    const map = L.map('map').setView([data.flightInfo.latitude, data.flightInfo.longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const { latitude, longitude } = data.flightInfo;
    L.marker([latitude, longitude]).addTo(map);

    return () => {
      map.remove();
    };
  }, [data]);

  return <div id="map" style={{ height: '400px' }}></div>;
}

export default MapComponent;
