const axios = require('axios');
const EventEmitter = require('events');
const redisServices = require('./redisServices');
const { isLocalTime } = require('neo4j-driver');
require('dotenv').config();


class FlightDataRTPubService extends EventEmitter {

    static getInstance() {
        if (!FlightDataRTPubService.instance) {
            FlightDataRTPubService.instance = new FlightDataRTPubService();
        }
        return FlightDataRTPubService.instance;
    }

    constructor() {
        super();
        this.state = 'idle';
    }

    sleep(ms) {
        this.state = 'sleeping';
        this.emit('sleeping');
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async collectRTDataFromAPI() {
        await this.parseAPIData('states/all');
        await this.sleep(process.env.API_REFRESH_RATE);
        await this.collectRTDataFromAPI();
    }

    async getDataFromAPI(endpoint) {
        this.state = 'fetching';
        this.emit('fetching');
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
        this.getDataFromAPI(endpoint)
            .then((data) => {
                const parsedData = data.states.map(state => ({
                    callsign: state[1].replace(/\s/g, ''),
                    data: {
                        longitude: state[5],
                        latitude: state[6],
                        altitude: state[7],
                        icao24: state[0],
                        originCountry: state[2],
                    }
                }))
                // const filteredData = parsedData.filter(item => item.data.longitude && item.data.latitude);
                const obj = this.convertArrayToObject(parsedData);
                this.publishDataOnRedisChannel(JSON.stringify(obj));
            })
            .catch((error) => {
                console.error("Error Fetching Data", error);
            });

    }

    publishDataOnRedisChannel(data) {
        this.state = 'publishing';
        this.emit('publishing');
        const channel = process.env.REDIS_PUB_FLIGHT_RADAR;
        const redisClient = redisServices.redisConnector();
        redisClient.publish(channel, data, (err) => {
            if (err) {
                console.error('Error publishing data on Redis:', err);
            } else {
                redisClient.expire(channel, process.env.REDIS_FR_TTL);
            }
        })
    }

    convertArrayToObject(dataArray) {
        const jsonObject = {};
      
        for (const item of dataArray) {
          if (item.callsign && item.data && item.data.longitude && item.data.latitude && item.data.altitude) {
            const marker = {
              longitude: item.data.longitude,
              latitude: item.data.latitude,
              altitude: item.data.altitude,
              icao24: item.data.icao24,
              originCountry: item.data.originCountry,
            };
            jsonObject[item.callsign] = marker;
          }
        }
      
        return jsonObject;
      }

};

module.exports = FlightDataRTPubService;