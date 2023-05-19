const MongoClient = require('mongodb').MongoClient;

const cities = [
  {
    area: "Berlin",
    coords: {
      lat: "52.520008",
      lon: "13.404954",
    },
    name: "Berlin",
    state: "Berlin",
  },
  {
    area: "Frankfurt",
    coords: {
      lat: "50.110924",
      lon: "8.682127",
    },
    name: "Frankfurt",
    state: "Hesse",
  },
  {
    area: "Munich",
    coords: {
      lat: "48.135125",
      lon: "11.581981",
    },
    name: "Munich",
    state: "Bavaria",
  },
  {
    area: "Hamburg",
    coords: {
      lat: "53.551086",
      lon: "9.993682",
    },
    name: "Hamburg",
    state: "Hamburg",
  },
  {
    area: "Düsseldorf",
    coords: {
      lat: "51.227741",
      lon: "6.773456",
    },
    name: "Düsseldorf",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Cologne",
    coords: {
      lat: "50.937531",
      lon: "6.960279",
    },
    name: "Cologne",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Stuttgart",
    coords: {
      lat: "48.775845",
      lon: "9.182932",
    },
    name: "Stuttgart",
    state: "Baden-Württemberg",
  },
  {
    area: "Nuremberg",
    coords: {
      lat: "49.45203",
      lon: "11.07675",
    },
    name: "Nuremberg",
    state: "Bavaria",
  },
  {
    area: "Hannover",
    coords: {
      lat: "52.375891",
      lon: "9.73201",
    },
    name: "Hannover",
    state: "Lower Saxony",
  },
  {
    area: "Leipzig",
    coords: {
      lat: "51.339695",
      lon: "12.373075",
    },
    name: "Leipzig",
    state: "Saxony",
  },
  {
    area: "Bremen",
    coords: {
      lat: "53.079296",
      lon: "8.801694",
    },
    name: "Bremen",
    state: "Bremen",
  },
  {
    area: "Dresden",
    coords: {
      lat: "51.050409",
      lon: "13.737262",
    },
    name: "Dresden",
    state: "Saxony",
  },
  {
    area: "Dortmund",
    coords: {
      lat: "51.513587",
      lon: "7.465298",
    },
    name: "Dortmund",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Münster",
    coords: {
      lat: "51.961429",
      lon: "7.625856",
    },
    name: "Münster",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Karlsruhe",
    coords: {
      lat: "49.00689",
      lon: "8.403653",
    },
    name: "Karlsruhe",
    state: "Baden-Württemberg",
  },
  {
    area: "Essen",
    coords: {
      lat: "51.455643",
      lon: "7.011555",
    },
    name: "Essen",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Mannheim",
    coords: {
      lat: "49.487459",
      lon: "8.466039",
    },
    name: "Mannheim",
    state: "Baden-Württemberg",
  },
  {
    area: "Duisburg",
    coords: {
      lat: "51.434407",
      lon: "6.762329",
    },
    name: "Duisburg",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Bochum",
    coords: {
      lat: "51.481845",
      lon: "7.216236",
    },
    name: "Bochum",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Wuppertal",
    coords: {
      lat: "51.256212",
      lon: "7.150764",
    },
    name: "Wuppertal",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Bielefeld",
    coords: {
      lat: "52.030228",
      lon: "8.532471",
    },
    name: "Bielefeld",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Bonn",
    coords: {
      lat: "50.73743",
      lon: "7.098206",
    },
    name: "Bonn",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Münster",
    coords: {
      lat: "51.961429",
      lon: "7.625856",
    },
    name: "Münster",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Augsburg",
    coords: {
      lat: "48.370545",
      lon: "10.89779",
    },
    name: "Augsburg",
    state: "Bavaria",
  },
  {
    area: "Bayreuth",
    coords: {
      lat: "49.941867",
      lon: "11.07582",
    },
    name: "Bayreuth",
    state: "Bavaria",
  },
  {
    area: "Bremerhaven",
    coords: {
      lat: "53.539584",
      lon: "8.580943",
    },
    name: "Bremerhaven",
    state: "Bremen",
  },
  {
    area: "Cottbus",
    coords: {
      lat: "51.759248",
      lon: "14.332647",
    },
    name: "Cottbus",
    state: "Brandenburg",
  },
  {
    area: "Dortmund",
    coords: {
      lat: "51.513587",
      lon: "7.465298",
    },
    name: "Dortmund",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Friedrichshafen",
    coords: {
      lat: "47.654154",
      lon: "9.479558",
    },
    name: "Friedrichshafen",
    state: "Baden-Württemberg",
  },
  {
    area: "Göttingen",
    coords: {
      lat: "51.532761",
      lon: "9.935307",
    },
    name: "Göttingen",
    state: "Lower Saxony",
  },
  {
    area: "Halle (Saale)",
    coords: {
      lat: "51.482504",
      lon: "11.969928",
    },
    name: "Halle (Saale)",
    state: "Saxony-Anhalt",
  },
  {
    area: "Heidelberg",
    coords: {
      lat: "49.398752",
      lon: "8.672434",
    },
    name: "Heidelberg",
    state: "Baden-Württemberg",
  },
  {
    area: "Heilbronn",
    coords: {
      lat: "49.142692",
      lon: "9.21891",
    },
    name: "Heilbronn",
    state: "Baden-Württemberg",
  },
  {
    area: "Ingolstadt",
    coords: {
      lat: "48.766611",
      lon: "11.425184",
    },
    name: "Ingolstadt",
    state: "Bavaria",
  },
  {
    area: "Jena",
    coords: {
      lat: "50.927054",
      lon: "11.589237",
    },
    name: "Jena",
    state: "Thuringia",
  },
  {
    area: "Kaiserslautern",
    coords: {
      lat: "49.444524",
      lon: "7.768557",
    },
    name: "Kaiserslautern",
    state: "Rhineland-Palatinate",
  },
  {
    area: "Kassel",
    coords: {
      lat: "51.312711",
      lon: "9.479746",
    },
    name: "Kassel",
    state: "Hesse",
  },
  {
    area: "Kiel",
    coords: {
      lat: "54.323292",
      lon: "10.122765",
    },
    name: "Kiel",
    state: "Schleswig-Holstein",
  },
  {
    area: "Koblenz",
    coords: {
      lat: "50.356943",
      lon: "7.588996",
    },
    name: "Koblenz",
    state: "Rhineland-Palatinate",
  },
  {
    area: "Landshut",
    coords: {
      lat: "48.544193",
      lon: "12.146853",
    },
    name: "Landshut",
    state: "Bavaria",
  },
  {
    area: "Lübeck",
    coords: {
      lat: "53.865467",
      lon: "10.686559",
    },
    name: "Lübeck",
    state: "Schleswig-Holstein",
  },
  {
    area: "Ludwigshafen am Rhein",
    coords: {
      lat: "49.48121",
      lon: "8.44641",
    },
    name: "Ludwigshafen am Rhein",
    state: "Rhineland-Palatinate",
  },
  {
    area: "Magdeburg",
    coords: {
      lat: "52.120533",
      lon: "11.627624",
    },
    name: "Magdeburg",
    state: "Saxony-Anhalt",
  },
  {
    area: "Mainz",
    coords: {
      lat: "50.002878",
      lon: "8.24713",
    },
    name: "Mainz",
    state: "Rhineland-Palatinate",
  },
  {
    area: "Mönchengladbach",
    coords: {
      lat: "51.191339",
      lon: "6.441718",
    },
    name: "Mönchengladbach",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Oldenburg",
    coords: {
      lat: "53.14355",
      lon: "8.214552",
    },
    name: "Oldenburg",
    state: "Lower Saxony",
  },
  {
    area: "Osnabrück",
    coords: {
      lat: "52.278989",
      lon: "8.043891",
    },
    name: "Osnabrück",
    state: "Lower Saxony",
  },
  {
    area: "Paderborn",
    coords: {
      lat: "51.718191",
      lon: "8.757536",
    },
    name: "Paderborn",
    state: "North Rhine-Westphalia",
  },
  {
    area: "Potsdam",
    coords: {
      lat: "52.396477",
      lon: "13.057745",
    },
    name: "Potsdam",
    state: "Brandenburg",
  },
  {
    area: "Regensburg",
    coords: {
      lat: "49.013428",
      lon: "12.101624",
    },
    name: "Regensburg",
    state: "Bavaria",
  },
  {
    area: "Rostock",
    coords: {
      lat: "54.083414",
      lon: "12.100956",
    },
    name: "Rostock",
    state: "Mecklenburg-Vorpommern",
  },
  {
    area: "Saarbrücken",
    coords: {
      lat: "49.235388",
      lon: "6.981987",
    },
    name: "Saarbrücken",
    state: "Saarland",
  },
  {
    area: "Würzburg",
    coords: {
      lat: "49.791304",
      lon: "9.953355",
    },
    name: "Würzburg",
    state: "Bavaria",
  },
];


const uri = 'DB STRING';
const dbName = 'DB NAME';

async function runScript() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);




    const uniqueStates = [...new Set(cities.map(city => city.state))];

    // Find or create the country document for Germany
    let germany = await db.collection('countries').findOne({ name: 'Germany' });
    if (!germany) {
      germany = await db.collection('countries').insertOne({ name: 'Germany' });
    }


    // Iterate over the unique states and insert them into the states collection
    
    for (const state of uniqueStates) {
      await db.collection('states').insertOne({
        name: state,
        country: germany._id
      });
    }
    

    // Insert the cities into the cities collection
    await db.collection('cities').insertMany(cities);

    //MongoShell Scripts

    db.cities.updateMany({}, { $unset: { state: 1 } }) 

    db.cities.updateMany({}, { $unset: { region: 1 } }) 

    db.cities.updateMany({}, { $set: { country: db.countries.findOne({ name: "Germany" })._id  }}) 


    console.log('Script executed successfully.');
    client.close();
  } catch (error) {
    console.error('Error executing script:', error);
  }
}

runScript();
