const fs = require('fs');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://USERNANE:PASSWORD@HOST/?retryWrites=true&w=majority';

// Database Name
const dbName = 'test';

// Collection Name
const collectionName = 'routes';

// JSON file path
const filePath = '../../../datasets/routes.json';

async function importJSON() {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Create a new MongoClient
    const client = new MongoClient(url);

    // Connect to the MongoDB server
    await client.connect();

    // Get the database instance
    const db = client.db(dbName);

    // Get the collection
    const collection = db.collection(collectionName);

    // Insert the data into the collection
    const result = await collection.insertMany(data);

    console.log(`Imported ${result.insertedCount} documents into the collection ${collectionName}`);

    // Close the connection
    await client.close();
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Call the importJSON function
importJSON();
