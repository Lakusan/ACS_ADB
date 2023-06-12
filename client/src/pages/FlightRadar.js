import React, { Component, createRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";
import SocketReceiver from '../components/SocketReceiver';

class FlightRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: {},
      prevMarkers: {},
      srhLocation: {
        geocode: [49.41386, 8.65164],
        popUp: "SRH Heidelberg"
      },
      srhIcon: new L.Icon({
        iconUrl: 'https://www.srh-hochschule-heidelberg.de/typo3conf/ext/site_srh_edu/Resources/Public/Favicons/apple-touch-icon-hochschule.png',
        iconSize: [38, 38]
      }),
      airplaneIcon: new L.Icon({
        //https://www.pngwing.com/en/free-png-kbngs
        iconUrl: require('../resources/arrow_up.png'),
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        rotationAngle: 0,
        rotationOrigin: 'center'
      }),
    };
  }

  componentDidMount() {
    L.Marker.prototype.options.icon = this.state.airplaneIcon;
  }

  handleDataReceived = (data) => {
    const parsedData = JSON.parse(data);
    this.setState((prevState) => ({
      prevMarkers: prevState.markers,
      markers: parsedData
    }));
  };

  renderMarkers() {
    const { markers, prevMarkers } = this.state;
    const markerElements = [];
    Object.entries(markers).forEach(([callsign, currentPosition]) => {
      const prevMarker = prevMarkers[callsign];
      if (prevMarker) {
        const prevPosition = [prevMarker.latitude, prevMarker.longitude];
        const position = [currentPosition.latitude, currentPosition.longitude];
        const bearing = this.calculateBearing(prevPosition, position);

        const rotatedIcon = this.createRotatedIcon(this.state.airplaneIcon, bearing);

        markerElements.push(
          <Marker key={callsign} position={position} rotationAngle={bearing} rotationOrigin="center" icon={rotatedIcon}>
            <Popup>
              Callsign: {callsign}<br />
              Latitude: {currentPosition.latitude}<br />
              Longitude: {currentPosition.longitude}<br />
              Altitude: {currentPosition.altitude}<br />
              ICAO24: {currentPosition.icao24}<br />
              Origin Country: {currentPosition.originCountry}
            </Popup>
          </Marker>
        );
      }
    });

    return markerElements;
  }

  calculateBearing = (prevPosition, currentPosition) => {
    const lat1 = prevPosition[0];
    const lon1 = prevPosition[1];
    const lat2 = currentPosition[0];
    const lon2 = currentPosition[1];

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  createRotatedIcon = (icon, rotationAngle) => {
    const rotatedIcon = L.icon({
      iconUrl: icon.options.iconUrl,
      iconSize: icon.options.iconSize,
      iconAnchor: icon.options.iconAnchor,
      rotationAngle: rotationAngle
    });

    return rotatedIcon;
  };

  render() {
    return (
      <div className='App'>
        <h1>Flight Radar</h1>
        <MapContainer center={this.state.srhLocation.geocode} zoom={8} style={{ height: '800px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
          />
          <Marker position={this.state.srhLocation.geocode} icon={this.state.srhIcon}>
            <Popup>{this.state.srhLocation.popUp}</Popup>
          </Marker>
          {this.renderMarkers()}
        </MapContainer>
        <SocketReceiver onDataReceived={this.handleDataReceived} />
      </div>
    );
  }
}

export default FlightRadar;