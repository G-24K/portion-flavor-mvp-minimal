import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://glorious-space-waddle-7v76jrwjgpp93rjq5-3000.app.github.dev/restaurants')
      .then(res => {
        console.log('Fetch response status:', res.status);
        console.log('Fetch response headers:', [...res.headers.entries()]);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setRestaurants(data);
          setFilteredRestaurants(data);
        } else {
          throw new Error('Fetched data is not an array');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load restaurants: ' + err.message);
      });
  }, []);

  const filterByPortion = (portion) => {
    if (!portion) {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(restaurants.filter(r => r.portion === portion));
    }
  };

  const filterByFlavor = (flavor) => {
    if (!flavor) {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(restaurants.filter(r => r.flavor === flavor));
    }
  };

  return (
    <div className="App">
      <h1>Portion & Flavor App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="filters">
        <label>
          Portion Size:
          <select onChange={(e) => filterByPortion(e.target.value)} disabled={restaurants.length === 0}>
            <option value="">Select</option>
            <option value="Stingy">Stingy</option>
            <option value="Fair">Fair</option>
            <option value="Generous">Generous</option>
          </select>
        </label>
        <label>
          Flavor Rating:
          <select onChange={(e) => filterByFlavor(e.target.value)} disabled={restaurants.length === 0}>
            <option value="">Select</option>
            <option value="EWWW Disgusting">EWWW Disgusting</option>
            <option value="It's just Ok">It's just Ok</option>
            <option value="Yummy Delicious">Yummy Delicious</option>
          </select>
        </label>
      </div>
      <ul className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((r, i) => (
            <li key={i}>
              {r.name} - Portion: {r.portion}, Flavor: {r.flavor}
            </li>
          ))
        ) : (
          <p>No restaurants to display.</p>
        )}
      </ul>
    </div>
  );
}

export default App;