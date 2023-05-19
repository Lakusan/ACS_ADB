/* global use, db */
// MongoDB 
// Author: Ugurcan Kaya


// Select the database to use.
use('test');

//Create State Schema

db.createCollection('states', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'country'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Name of the state',
        },
        country: {
          bsonType: 'objectId',
          description: 'Reference to the country collection',
        },
        // Other necessary details specific to your flight tracking application
      },
    },
  },
});



//Insert States
db.states.deleteMany({});
db.getCollection('states').insertMany([
  {
    name: 'Berlin',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Brandenburg',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Bremen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Hamburg',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Hessen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Mecklenburg-Vorpommern',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Niedersachsen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Nordrhein-Westfalen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Rheinland-Pfalz',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Saarland',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Sachsen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Sachsen-Anhalt',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Schleswig-Holstein',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Thüringen',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Bayern',
    country: db.countries.findOne({ name: 'Germany' })._id,
  },
  {
    name: 'Schleswig-Holstein',
    country: db.countries.findOne({ name: 'Germany' })._id,
  }
]);



//Create aggregate query to validate State and Country
db.states.aggregate([
  {
    $lookup: {
      from: 'countries',
      localField: 'country',
      foreignField: '_id',
      as: 'country',
    },
  },
  {
    $unwind: '$country',
  },
]);




