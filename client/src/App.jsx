import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
      })
      .catch(err => {
        setError('Failed to load restaurants');
        console.error('Fetch error:', err);
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
      setFilteredRestaurants(restaurants.filter(r => r.flavor === parseInt(flavor)));
    }
  };

  return (
    <div className="App">
      <h1>Portion & Flavor App</h1>
      <div className="filters">
        <label>
          Portion Size:
          <select onChange={(e) => filterByPortion(e.target.value)}>
            <option value="">All</option>
            <option value="Stingy">Small</option>
            <option value="Fair">Medium</option>
            <option value="Generous">Large</option>
          </select>
        </label>
        <label>
          Flavor Rating:
          <select onChange={(e) => filterByFlavor(e.target.value)}>
          <option value="">All</option>
          <option value="1">EWWW Disgusting</option>
          <option value="2">It's just Ok</option>
          <option value="3">Yummy Delicious</option>
          </select>
        </label>
      </div>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul className="restaurant-list">
          {filteredRestaurants.map((r, i) => (
            <li key={i}>
              {r.name} - Portion: {r.portion}, Flavor: {r.flavor} stars
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;