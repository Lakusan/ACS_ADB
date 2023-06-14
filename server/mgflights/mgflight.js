const { MongoClient } = require('mongodb');
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://flight-data4.p.rapidapi.com/get_flight_info',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
  }
};

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_CONNECT);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function fetchDataFromAPI(flight) {
  try {
    const flightOptions = {
      ...options,
      params: {
        flight: flight
      }
    };

    const response = await axios.request(flightOptions);
    console.log('API Response:', response.data); // Log the API response
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }
}

async function transformData(data) {
  if (!data || !data.flight || !data.flight.latitude) {
    console.error('Flight data is null or missing latitude');
    return null;
  }

  try {
    const transformedData = {
      flight: {
        latitude: data.flight.latitude,
        longitude: data.flight.longitude,
        callsign: data.flight.callsign,
        iata: data.flight.iata,
        altitude: data.flight.altitude,
        heading: data.flight.heading,
        groundspeed: data.flight.groundspeed,
        dep_scheduled: data.flight.dep_scheduled,
        dep_actual: data.flight.dep_actual,
        arr_scheduled: data.flight.arr_scheduled,
        arr_estimated: data.flight.arr_estimated,
        distance: data.flight.distance,
        id: data.flight.id
      },
      airline: {
        icao: data.airline?.icao || null,
        iata: data.airline?.iata || null,
        name: data.airline?.name || null
      },
      aircraft: {
        reg: data.aircraft?.reg || null,
        photo1: data.aircraft?.photo1 || null,
        photo2: data.aircraft?.photo2 || null,
        type: data.aircraft?.type || null,
        desc: data.aircraft?.desc || null,
        number: data.aircraft?.number || null
      },
      dep_airport: {
        latitude: data.dep_airport?.latitude || null,
        longitude: data.dep_airport?.longitude || null,
        icao: data.dep_airport?.icao || null,
        iata: data.dep_airport?.iata || null,
        name: data.dep_airport?.name || null,
        city: data.dep_airport?.city || null,
        timezone_abbr: data.dep_airport?.timezone_abbr || null,
        timezone_name: data.dep_airport?.timezone_name || null,
        timezone: data.dep_airport?.timezone || null
      },
      arr_airport: {
        latitude: data.arr_airport?.latitude || null,
        longitude: data.arr_airport?.longitude || null,
        icao: data.arr_airport?.icao || null,
        iata: data.arr_airport?.iata || null,
        name: data.arr_airport?.name || null,
        city: data.arr_airport?.city || null,
        timezone_abbr: data.arr_airport?.timezone_abbr || null,
        timezone_name: data.arr_airport?.timezone_name || null,
        timezone: data.arr_airport?.timezone || null
      },
      source: data.source || null,
      station: data.station || null
    };

    return transformedData;
  } catch (error) {
    console.error('Error transforming data:', error);
    return null;
  }
}

// async function insertDataIntoMongoDB(data) {
//     try {
//       const client = await connectToDatabase();
//       const db = client.db('test');
//       const collection = db.collection('flightsinfo');
  
//       await collection.insertMany(data);
//       console.log('Data inserted into MongoDB');
//       client.close();
//     } catch (error) {
//       console.error('Error inserting data into MongoDB:', error);
//       throw error;
//     }
//   }

async function insertDataIntoMongoDB(dataArray) {
    try {
      const client = await connectToDatabase();
      const db = client.db('test');
      const collection = db.collection('flightsinfo');
  
      await collection.insertMany(dataArray);
      console.log('Data inserted into MongoDB');
      client.close();
    } catch (error) {
      console.error('Error inserting data into MongoDB:', error);
      throw error;
    }
  }
  

  async function importData(flightCodes) {
    try {
      const dataArray = [];
      for (const flightCode of flightCodes) {
        const flightData = await fetchDataFromAPI(flightCode);
        console.log('API Response:', flightData);
  
        if (flightData) {
          const transformedData = await transformData(flightData[flightCode]);
          console.log('Flight data:', transformedData);
  
          if (transformedData) {
            dataArray.push(transformedData);
          } else {
            console.error('Error transforming flight data');
          }
        } else {
          console.error('Flight data is null');
        }
      }
  
      if (dataArray.length > 0) {
        await insertDataIntoMongoDB(dataArray);
      } else {
        console.error('No data to insert');
      }
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
  
  
importData();
