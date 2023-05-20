//List Airports in Turkey

db.airports.aggregate([
    {
      $lookup: {
        from: "countries",
        localField: "country",
        foreignField: "_id",
        as: "country_info"
      }
    },
    {
      $match: {
        "country_info.name": "Turkey"
      }
    },
    {
      $project: {
        _id: 1,
        airport_id: 1,
        name: 1,
        city: 1,
        iata: 1,
        icao: 1,
        latitude: 1,
        longitude: 1,
        altitude: 1,
        timezone: 1,
        dst: 1,
        tz_database_timezone: 1,
        type: 1
      }
    }
  ])
  