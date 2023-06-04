// import React from 'react';

// export function AirportInformation() {
//   return (
//     <>
//     <h1> Airport Information </h1>
//     </>
//   );
// }

import React from 'react';
import SearchFlight from '../components/SearchFlight';
import '../App.css';
import Arrivals from '../components/Arrivals';

export function AirportInformation(){
  return (
    <div className="content" style={{textAlign:'center'}}>
        <h1>Flight Search</h1>
      <SearchFlight />
    </div>
  );
}

// import React, { useState } from 'react';
// import Arrivals from './components/flights/Arrivals';

// const cities = ['JFK', 'LHR', 'CDG', 'HND']; // List of airport codes to select from

// const App = () => {
//   const [selectedCity, setSelectedCity] = useState('');

//   const handleCityChange = (event) => {
//     setSelectedCity(event.target.value);
//   };

//   return (
//     <div>
//       <h1>OpenSky Network Arrivals</h1>
//       <select value={selectedCity} onChange={handleCityChange}>
//         <option value="">Select an airport</option>
//         {cities.map((city) => (
//           <option value={city} key={city}>
//             {city}
//           </option>
//         ))}
//       </select>
//       {selectedCity && <Arrivals selectedCity={selectedCity} />}
//     </div>
//   );
// };

// export default App;


