const fs = require('fs');

async function createCollectionFromJSON() {
  const uri = 'mongodb+srv://root:uKwvqgrm5hsUEKmj@cluster0.w8v8ygi.mongodb.net/?retryWrites=true&w=majority';
  const client = new Mongo(uri);

  try {
    await client.connect();

    const jsonData = fs.readFileSync('json/cities.json', 'utf8');
    const cities = JSON.parse(jsonData);

    const citiesCollection = client.db().collection('cities');
    await citiesCollection.insertMany(cities);

    print('Collection created and data inserted successfully');
  } catch (error) {
    print('Error creating collection:', error);
  } finally {
    client.close();
  }
}

//createCollectionFromJSON();


//update cities with state id

db.cities.find().forEach(function(city) {
  var state = db.states.findOne({ name: city.state });
  if (state) {
    db.cities.updateOne(
      { _id: city._id },
      { $set: { state: state._id } }
    );
  }
});

//create index for location
db.cities.createIndex({ location: '2dsphere' });
