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
      markers: [],
      prevMarkers: [],
      srhLocation: {
        geocode: [49.41386, 8.65164],
        popUp: "SRH Heidelberg"
      },
      srhIcon: new Icon({
        iconUrl: 'https://www.srh-hochschule-heidelberg.de/typo3conf/ext/site_srh_edu/Resources/Public/Favicons/apple-touch-icon-hochschule.png',
        iconSize: [38, 38]
      }),
      airplaneIcon: new L.Icon({
        iconUrl: require('../resources/icon-airplane.png'),
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      }),
    };
  }

  handleDataReceived = (data) => {
    const parsedData = JSON.parse(data);
    this.setState({ prevMarkers: this.state.markers });
    this.setState({ markers: parsedData });
    const entryCount = Object.keys(parsedData).length;
    console.log(entryCount);
  };

  renderMarkers() {
    const { markers, airplaneIcon } = this.state;
    const markerElements = [];
    Object.entries(markers).forEach((marker) => {
      const position = [marker[1].latitude, marker[1].longitude];
      markerElements.push(
        <Marker key={marker[0]} position={position} icon={airplaneIcon} rotationAngle={45}>
          <Popup>
            Callsign: {marker[0]}<br />
            Latitude: {marker[1].latitude}<br />
            Longitude: {marker[1].longitude}<br />
            Altitude: {marker[1].altitude}<br />
            ICAO24: {marker[1].icao24}<br />
            Origin Country: {marker[1].originCountry}
          </Popup>
        </Marker>
      );
    })
    return markerElements;
  }

  //[49.41386, 8.65164] srh
  // 49.41238, 8.64777 hORNBACH
  calculateDirectionVector(prevLat, prevLng, newLat, newLng){
    const toRadians = (degrees) => (degrees * Math.PI / 180);
    const toDegrees = (radians) => (radians * 180) / Math.PI;

    const phi1 = toRadians(prevLat);
    const phi2 = toRadians(newLat);
    const deltaLambda = toRadians(newLng - prevLng);

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x =
      Math.cos(phi1) * Math.sin(phi2) -
      Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    let bearing = Math.atan2(y, x);

    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360;

    return bearing;
  }

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
            <Popup>
              {this.state.srhLocation.popUp}
            </Popup>
          </Marker>
          {this.renderMarkers()}
        </MapContainer>
        <SocketReceiver onDataReceived={this.handleDataReceived} />
      </div>
    );
  }
}

export default FlightRadar;