import { Route, Routes , Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { FlightRadar } from './pages/FlightRadar';
import { AirportFinder } from './pages/AirportFinder';
import { FlightFinder } from './pages/FlightFinder';
import { FlightTracker } from './pages/FlightTracker';
import { AirportInformation } from './pages/AirportInformation';


function App() {
  return (
    <>
    <nav>
      <ul>
        <li>
          <Link to="/"> Home </Link>
        </li>
        <li>
          <Link to="/radar"> Flight Radar Andreas</Link>
        </li>
        <li>
          <Link to="/airport/finder"> Aiport Finder Harshitha </Link>
        </li>
        <li>
          <Link to="/flight"> Flight Finder Satish </Link>
        </li>
        <li>
          <Link to="/tracker"> Flight Tracker Ugurcan </Link>
        </li>
        <li>
          <Link to="/airport/info"> Airport information Monisha </Link>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/radar" element={<FlightRadar />} />
      <Route path="/airport/finder" element={<AirportFinder />} />
      <Route path="/flight" element={<FlightFinder />} />
      <Route path="/tracker" element={<FlightTracker />} />
      <Route path="/airport/info" element={<AirportInformation />} />
    </Routes>
    </>
  );
}

export default App;
