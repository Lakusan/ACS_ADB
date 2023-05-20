/* These commands should be performed after data is imported. 


Airports Collection

1.Map airports.country with countries.name
*/
var count = 0;
db.airports.find({ "country": { $type: "string" } }).forEach(function(airport) {
  var country = airport.country;
  var countryRecord = db.countries.findOne({ name: country }, { _id: 1 });

  if (countryRecord !== null) {
    var countryId = countryRecord._id;
    db.airports.updateOne({ _id: airport._id }, { $set: { country: countryId } });
    count++;
    print("Updated country for airport: " + airport.name);
  } else {
    print("No matching country found for airport: " + airport.name);
  }
});
print("Total rows processed: " + count);





//2.Remove Airport records which in country field is not referred to country collections, if it has objectId it means matched, but if it is string it should be removed.

var count = 0;

db.airports.find().forEach(function(airport) {
  var country = airport.country;

  // Check if the country field is an ObjectId or a string
  if (typeof country === 'string') {
    // Search for a matching country record in the countries collection
    var countryRecord = db.countries.findOne({ name: country });

    // If no matching country record is found, remove the airport record
    if (!countryRecord) {
      db.airports.deleteOne({ _id: airport._id });
      count++;
      print("Removed airport: " + airport.name);
    }
  }
});

print("Total airports removed: " + count);





/*

Routes Collection


1.Map Airport Source and Destination with Airports._id field
*/


// Create an array to store the bulk operations
var bulkOps = [];

// Iterate through the routes collection
db.routes.find({
  $or: [
    { source_airport: { $type: "string" } },
    { destination_airport: { $type: "string" } }
  ]
}).forEach(function (route) {
  var sourceAirportCode = route.source_airport;
  var destinationAirportCode = route.destination_airport;

  var sourceAirport = db.airports.findOne({ $or: [{ iata: sourceAirportCode }, { icao: sourceAirportCode }] });
  var destinationAirport = db.airports.findOne({ $or: [{ iata: destinationAirportCode }, { icao: destinationAirportCode }] });

  if (sourceAirport && destinationAirport) {
    var sourceAirportId = sourceAirport._id;
    var destinationAirportId = destinationAirport._id;

    // Add the update operation to the bulkOps array
    bulkOps.push({
      updateOne: {
        filter: { _id: route._id },
        update: { $set: { source_airport: sourceAirportId, destination_airport: destinationAirportId } }
      }
    });

    // Print the updated route
    print("Updated route with ID: " + route._id);
    print("Source Airport: " + sourceAirportId);
    print("Destination Airport: " + destinationAirportId);

    // Execute bulk update every 1000 operations
    if (bulkOps.length === 1000) {
      db.routes.bulkWrite(bulkOps);
      bulkOps = [];
    }
  } else {
    print("No matching airport found for route with ID: " + route._id);
  }
});

// Execute any remaining bulk update operations
if (bulkOps.length > 0) {
  db.routes.bulkWrite(bulkOps);
}

print("Update process completed.");

//2.Remove the routes which does not have any mapped airport from airports collection
var bulk = db.routes.initializeOrderedBulkOp();
bulk.find({$or: [{ source_airport: { $type: 'string' }},{ destination_airport: { $type: 'string' }}]}).remove();
bulk.execute()

//3.Map Route Equipments
// Create a lookup dictionary for planes
var planesLookup = {};
var planesCursor = db.planes.find({
  $or: [
    { iata_code: { $exists: true } },
    { icao_code: { $exists: true } }
  ]
});
while (planesCursor.hasNext()) {
  var plane = planesCursor.next();
  if (plane.iata_code) planesLookup[plane.iata_code] = plane._id;
  if (plane.icao_code) planesLookup[plane.icao_code] = plane._id;
}

var bulkUpdates = [];
var batchSize = 1000; // Number of routes to process in each bulk operation
var updatedRoutesCount = 0;

var routesCursor = db.routes.find();
while (routesCursor.hasNext()) {
  var route = routesCursor.next();
  var iataCode = route.equipment;

  if (!iataCode) {
    print("No equipment code found for route with ID: " + route._id);
    continue; // Skip this iteration and continue with the next route
  }

  var planeId = planesLookup[iataCode];

  if (planeId) {
    bulkUpdates.push({
      updateOne: {
        filter: { _id: route._id },
        update: { $set: { equipment: planeId } }
      }
    });
    updatedRoutesCount++;
    print("Updated equipment for route with ID: " + route._id);

    // Execute the bulk operation for every batchSize routes
    if (bulkUpdates.length === batchSize) {
      db.routes.bulkWrite(bulkUpdates);
      bulkUpdates = [];
    }
  } else {
    print("No matching plane found for route with ID: " + route._id);
  }
}

// Execute any remaining bulk operations
if (bulkUpdates.length > 0) {
  db.routes.bulkWrite(bulkUpdates);
}

print("Total updated routes: " + updatedRoutesCount);
print("Update process completed.");

//4.set equipment as null if equpment does not not have any mapped equipment from planes collection
db.routes.updateMany(
  { "equipment": { $type: "string" } },
  { $set: { "routes.equipment": null } }
);


//5.Remove Unnecessary fields from routes collection
db.routes.updateMany({}, { $unset: { codeshare: "" } });
db.routes.updateMany({}, { $unset: { source_airport_id: "" } });
db.routes.updateMany({}, { $unset: { destination_airport_id: "" } });
db.routes.updateMany({}, { $unset: { airline_id: "" } });


//6.Map routes.airline with airlines._id
// Initialize bulk operations
let bulkOps = [];

// Get the fallback airline_id for null values
const fallbackAirlineId = ObjectId('6468b78e50f16e5608971594');

// Update each document in the routes collection
db.routes.find().forEach(function(route) {
  // Find the corresponding airline record using the airline IATA or ICAO code
  const airline = db.airlines.findOne(
    {
      $or: [
        { iata: route.airline },
        { icao: route.airline }
      ]
    },
    { _id: 1 }
  );
  
  // Determine the airline_id to set
  const airlineId = airline ? airline._id : fallbackAirlineId;

  // Add update operation to bulk operations
  bulkOps.push({
    updateOne: {
      filter: { _id: route._id },
      update: { $set: { airline_id: airlineId } }
    }
  });

  // Execute bulk operations every 1000 documents
  if (bulkOps.length >= 1000) {
    db.routes.bulkWrite(bulkOps);
    bulkOps = [];
  }
});

// Execute remaining bulk operations
if (bulkOps.length > 0) {
  db.routes.bulkWrite(bulkOps);
}




//7.remove extra field

db.routes.updateMany({}, { $unset: { airline: "" } });

//fix errors 
db.routes.updateMany({}, { $unset: { routes: 1 } });

// Initialize bulk operations
let bulkOps = [];

// Find documents where the 'equipment' field is of type string
const cursor = db.routes.find({ equipment: { $type: 'string' } });

// Iterate over the documents and add update operations to bulk
cursor.forEach(function(document) {
  bulkOps.push({
    updateOne: {
      filter: { _id: document._id },
      update: { $set: { equipment: ObjectId('64689881f8bd84d06137acb0') } }
    }
  });

  // Execute bulk operations every 1000 documents
  if (bulkOps.length >= 1000) {
    db.routes.bulkWrite(bulkOps);
    bulkOps = [];
  }
});

// Execute remaining bulk operations
if (bulkOps.length > 0) {
  db.routes.bulkWrite(bulkOps);
}

// Print the number of documents updated
print(`Number of documents updated: ${cursor.count()}`);


/* Airlines Collection */

//1.Map airlines.country with countries._id
// Initialize bulk operations
var bulkUpdateOps = [];
var count = 0;

db.airlines.find({ country: { $exists: true, $type: "string" } }).forEach(function(airline) {
  var country = db.countries.findOne({ name: airline.country });
  if (country) {
    bulkUpdateOps.push({
      updateOne: {
        filter: { _id: airline._id, country: { $exists: true, $type: "string" } },
        update: { $set: { country: country._id } }
      }
    });

    count++;
  }
});

if (bulkUpdateOps.length > 0) {
  var bulkResult = db.airlines.bulkWrite(bulkUpdateOps);

  print(`Total airlines updated: ${bulkResult.modifiedCount}`);
} else {
  print("No airlines to update.");
}

//2.Fix wrong data records that does not have country correctly.
db.airlines.updateMany(
  { country: { $exists: true, $type: "string" } },
  { $set: { country: null } }
);

