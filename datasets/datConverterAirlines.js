const fs = require('fs');

const datFilePath = 'airlines.dat';
const jsonFilePath = 'airlines.json';

const fieldNames = [
  'airline_id',
  'name',
  'alias',
  'iata',
  'icao',
  'callsign',
  'country',
  'active'
];

const data = [];

const fileData = fs.readFileSync(datFilePath, 'utf8');
const lines = fileData.trim().split('\n');

lines.forEach((line) => {
  const fieldValues = line.trim().split(',');
  const lineData = {};

  fieldValues.forEach((value, index) => {
    lineData[fieldNames[index]] = value;
  });

  data.push(lineData);
});

const jsonData = JSON.stringify(data, null, 2);

fs.writeFileSync(jsonFilePath, jsonData, 'utf8');

console.log('Conversion complete. JSON file saved.');
