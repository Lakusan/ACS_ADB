// Example data for flight calculation
const departureAirport = db.airports.findOne({ "iata": "SAW" });
const destinationAirport = db.airports.findOne({ "iata": "SIN" });
const aircraftRange = 13430; // Maximum range of an Airbus A340 in kilometers
const aircraftSpeed = 900; // Average aircraft speed in kilometers per hour
const aircraftFuelConsumption = 2.5; // Fuel consumption rate of Airbus A340 in liters per kilometer
const fuelPricePerLiter = 1.5; // Estimated fuel price per liter

// Calculate the flight distance between the departure and destination airports
const distance = db.airports.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [
          departureAirport.location.coordinates[0],
          departureAirport.location.coordinates[1]
        ]
      },
      distanceField: "distance",
      spherical: true,
      key: "location"
    }
  },
  {
    $addFields: {
      distance: {
        $multiply: ["$distance", 0.001] // Convert meters to kilometers
      }
    }
  },
  {
    $match: {
      _id: destinationAirport._id
    }
  }
]).next().distance;

// Check if the distance is within the aircraft's range
if (distance <= aircraftRange) {
  const fuelRequired = distance * aircraftFuelConsumption;
  const fuelCost = fuelRequired * fuelPricePerLiter;
  const flightTime = distance / aircraftSpeed;
  const hours = Math.floor(flightTime);
  const minutes = Math.round((flightTime - hours) * 60);

  print(`The flight distance between ${departureAirport.name} and ${destinationAirport.name} is ${distance.toFixed(2)} km.`);
  print(`The estimated flight time is ${hours} hours and ${minutes} minutes.`);
  print(`The estimated fuel required is ${fuelRequired.toFixed(2)} liters.`);
  print(`The estimated fuel cost is $${fuelCost.toFixed(2)}.`);

  // Check if the airplane has enough fuel capacity for the flight
  const airplaneFuelCapacity = 50000; // Example fuel capacity for an Airbus A340 in liters
  if (fuelRequired <= airplaneFuelCapacity) {
    print("The flight is within the airplane's range and fuel capacity.");

    // Generate HTML file with map visualization
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flight Path Visualization</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />
          <style>
            #map {
              height: 500px;
            }
          </style>
        </head>
        <body>
          <h1>Flight Details</h1>
          <p>
            <strong>Departure Airport:</strong> ${departureAirport.name} (${departureAirport.iata})<br/>
            <strong>Destination Airport:</strong> ${destinationAirport.name} (${destinationAirport.iata})<br/>
            <strong>Airplane Type:</strong> Airbus A340<br/>
            <strong>Flight Distance:</strong> ${distance.toFixed(2)} km<br/>
            <strong>Estimated Flight Time:</strong> ${hours} hours and ${minutes} minutes<br/>
            <strong>Estimated Fuel Required:</strong> ${fuelRequired.toFixed(2)} liters<br/>
            <strong>Estimated Fuel Cost:</strong> $${fuelCost.toFixed(2)}
          </p>
          <div id="map"></div>
          <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
          <script>
            const startCoordinates = [${departureAirport.location.coordinates[1]}, ${departureAirport.location.coordinates[0]}];
            const endCoordinates = [${destinationAirport.location.coordinates[1]}, ${destinationAirport.location.coordinates[0]}];

            const map = L.map('map').setView(startCoordinates, 5);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            L.marker(startCoordinates).addTo(map).bindPopup('${departureAirport.name} - Departure');
            L.marker(endCoordinates).addTo(map).bindPopup('${destinationAirport.name} - Destination');

            const flightPath = [startCoordinates, endCoordinates];
            L.polyline(flightPath, { color: 'blue' }).addTo(map);

            map.fitBounds([startCoordinates, endCoordinates]);
          </script>
        </body>
      </html>
    `;

    const fs = require('fs');
    fs.writeFileSync('flight_visualization.html', htmlContent);

    print("The flight visualization has been generated in 'flight_visualization.html' file.");
  } else {
    print("The flight is beyond the airplane's fuel capacity. It may require a refueling stop.");
  }
} else {
  print(`The flight distance between ${departureAirport.name} and ${destinationAirport.name} is ${distance.toFixed(2)} km.`);
  print("The flight is beyond the airplane's range. It may require a refueling stop or a different aircraft.");
}
