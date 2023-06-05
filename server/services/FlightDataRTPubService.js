const axios = require('axios');
const redisServices = require('./redisServices');
const redis = require('redis');
require('dotenv').config();


class FlightDataRTPubService {
    constructor(name) {
        this.name = name;
        console.log(`Class with name ${this.name} spawned`);
        // redisServices.redisConnect();
        // fetches data from api,
        // json stringify
        // stores data in redis
        // json parse
        // callsign: { origin: "country" }

    }

    destructor() {
        console.log(`${this.name} is destroyed`);
    }

    async getDataFromAPI(endpoint) {
        const apiURL = process.env.API_BASE_URL + endpoint;

        try {
            const response = await axios.get(apiURL, {
                auth: {
                    username: process.env.API_USERNAME,
                    password: process.env.API_PASSWORD
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            throw error;
        }
    }

    parseAPIData(endpoint) {
        const rawJSONData = this.getDataFromAPI(endpoint)
            .then((data) => {
                const parsedData = data.states.map(state => ({
                    icao24: state[0],
                    callsign: state[1].replace(/\s/g, ''), // Remove spaces from the flight callsign
                    originCountry: state[2],
                    longitude: state[5],
                    latitude: state[6],
                    altitude: state[7]
                }))
                this.publishDataOnRedisChannel(JSON.stringify(parsedData));
                // console.log(Object.entries(data)[0]);
                // console.log(data.states);
                // let tmpJSON = {};
                // parsedData.forEach(element => {
                //     if (element.callsign !== ''){
                //         console.log(`{${element.callsign}:{ longitude: ${element.longitude},latitude:${element.latitude}}`);
                //     } 
                // });
                // console.log(parsedData[0].callsign);
                // console.log(parsedData[0].longitude);
                // console.log(parsedData[0].latitude);
                // callsign longitide latitude
                // GLO1251: { longitude: -47.7574, latitude: -23.6635}
            })
            .catch((error) => {
                console.error("Error Fetching Data", error);
            });

    }

    publishDataOnRedisChannel(data) {
        const channel = process.env.REDIS_PUB_FLIGHT_RADAR;
        const redisClient = redisServices.redisConnector();
        // publish stringified Data with ttl of 1 sec
        redisClient.publish(channel, data, (err) => {
            if (err) {
                console.error('Error publishing data on Redis:', err);
            } else {
                console.log('Data published on Redis');
            }
        })
    }

};

module.exports = FlightDataRTPubService;