import { useState, useEffect } from 'react';
import './App.css';

// Main App component for the Portion & Flavor App
function App() {
  // State for managing restaurant data, filters, and UI views
  const [restaurants, setRestaurants] = useState([]); // All restaurants fetched from API
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Filtered list based on user input
  const [error, setError] = useState(null); // Error message for API failures
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Currently selected restaurant for details
  const [ratingTaste, setRatingTaste] = useState(0); // Rating form: taste (1-3)
  const [ratingPortion, setRatingPortion] = useState(0); // Rating form: portion (1-3)
  const [ratingService, setRatingService] = useState(0); // Rating form: service (1-3)
  const [ratingEatAgain, setRatingEatAgain] = useState(0); // Rating form: eat again (1-3)
  const [ratingOrderAgain, setRatingOrderAgain] = useState(0); // Rating form: order again (1-3)
  const [thankYouMessage, setThankYouMessage] = useState(false); // Show thank-you message after rating submission
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering by name
  const [portionFilter, setPortionFilter] = useState(''); // Filter for portion size
  const [flavorFilter, setFlavorFilter] = useState(''); // Filter for flavor rating
  const [serviceFilter, setServiceFilter] = useState(''); // Filter for service rating
  const [sortByRating, setSortByRating] = useState(false); // Toggle for sorting by average rating
  const [showRatingForm, setShowRatingForm] = useState(false); // Toggle for rating form view
  const [showDetails, setShowDetails] = useState(false); // Toggle for restaurant details view

  // Fetch restaurants on component mount
  useEffect(() => {
    setLoading(true);
    fetch('https://glorious-space-waddle-7v76jrwjgpp93rjq5-3000.app.github.dev/restaurants')
      .then(res => {
        console.log('Fetch response status:', res.status);
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
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate average rating for a restaurant based on all rating categories
  const getAverageRating = (ratings) => {
    if (ratings.total_reviews === 0) return 0;
    const avgTaste = ratings.sum_taste / ratings.total_reviews;
    const avgPortion = ratings.sum_portion / ratings.total_reviews;
    const avgService = ratings.sum_service / ratings.total_reviews;
    const avgEatAgain = ratings.sum_eat_again / ratings.total_reviews;
    const avgOrderAgain = ratings.sum_order_again / ratings.total_reviews;
    const overallAverage = (avgTaste + avgPortion + avgService + avgEatAgain + avgOrderAgain) / 5;
    return (overallAverage / 3) * 100; // Convert to percentage (0-100)
  };

  // Map average taste rating to a category (EWWW Disgusting, It's just Ok, Yummy Delicious)
  const mapTasteToCategory = (avgTaste) => {
    if (avgTaste <= 1.5) return 'EWWW Disgusting';
    if (avgTaste <= 2.5) return "It's just Ok";
    return 'Yummy Delicious';
  };

  // Map average portion rating to a category (Stingy, Fair, Generous)
  const mapPortionToCategory = (avgPortion) => {
    if (avgPortion <= 1.5) return 'Stingy';
    if (avgPortion <= 2.5) return 'Fair';
    return 'Generous';
  };

  // Map average service rating to a category (Terrible, Good, Exceptional)
  const mapServiceToCategory = (avgService) => {
    if (avgService <= 1.5) return 'Terrible';
    if (avgService <= 2.5) return 'Good';
    return 'Exceptional';
  };

  // Map "eat again" rating to a category (No, Maybe, Yes)
  const mapEatAgainToCategory = (avgEatAgain) => {
    if (avgEatAgain <= 1.5) return 'No';
    if (avgEatAgain <= 2.5) return 'Maybe';
    return 'Yes';
  };

  // Map "order again" rating to a category (No, Maybe, Yes)
  const mapOrderAgainToCategory = (avgOrderAgain) => {
    if (avgOrderAgain <= 1.5) return 'No';
    if (avgOrderAgain <= 2.5) return 'Maybe';
    return 'Yes';
  };

  // Submit a new rating for the selected restaurant
  const submitRating = () => {
    // Validate all ratings are provided and within range (1-3)
    if (!ratingTaste || !ratingPortion || !ratingService || !ratingEatAgain || !ratingOrderAgain ||
        ratingTaste < 1 || ratingTaste > 3 || ratingPortion < 1 || ratingPortion > 3 ||
        ratingService < 1 || ratingService > 3 || ratingEatAgain < 1 || ratingEatAgain > 3 ||
        ratingOrderAgain < 1 || ratingOrderAgain > 3) {
      alert('Please provide valid ratings (1-3)');
      return;
    }
    const rating = {
      taste: parseInt(ratingTaste, 10),
      portion: parseInt(ratingPortion, 10),
      service: parseInt(ratingService, 10),
      eat_again: parseInt(ratingEatAgain, 10),
      order_again: parseInt(ratingOrderAgain, 10),
    };
    fetch(`https://glorious-space-waddle-7v76jrwjgpp93rjq5-3000.app.github.dev/restaurants/${selectedRestaurant.id}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rating),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to submit rating');
        }
        return res.json();
      })
      .then(() => {
        setThankYouMessage(true);
        setTimeout(() => {
          setThankYouMessage(false);
          setShowRatingForm(false);
        }, 3000); // Show thank-you message for 3 seconds
        // Refresh restaurant list after submission
        fetch('https://glorious-space-waddle-7v76jrwjgpp93rjq5-3000.app.github.dev/restaurants')
          .then(res => res.json())
          .then(data => {
            setRestaurants(data);
            setFilteredRestaurants(data);
            setSelectedRestaurant(data.find(r => r.id === selectedRestaurant.id));
          });
        // Reset rating form
        setRatingTaste(0);
        setRatingPortion(0);
        setRatingService(0);
        setRatingEatAgain(0);
        setRatingOrderAgain(0);
      })
      .catch(err => {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating');
      });
  };

  // Filter and sort restaurants based on user input
  useEffect(() => {
    let filtered = restaurants;
    if (searchTerm) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (portionFilter) {
      filtered = filtered.filter(r => r.portion === portionFilter);
    }
    if (flavorFilter) {
      filtered = filtered.filter(r => r.flavor === flavorFilter);
    }
    if (serviceFilter) {
      filtered = filtered.filter(r => r.service === serviceFilter);
    }
    if (sortByRating) {
      filtered = filtered.sort((a, b) => {
        const aRating = getAverageRating(a.ratings);
        const bRating = getAverageRating(b.ratings);
        return bRating - aRating; // Sort descending by rating
      });
    }
    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, portionFilter, flavorFilter, serviceFilter, sortByRating]);

  return (
    <div className="App">
      <h1>Portion & Flavor App</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* Search bar and sort button */}
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setSortByRating(!sortByRating)}>
              {sortByRating ? 'Unsort' : 'Sort by Rating'}
            </button>
          </div>
          {/* Filters for portion, flavor, and service */}
          <div className="filters">
            <label className="portion-label">
              Portion Size:
              <select onChange={(e) => setPortionFilter(e.target.value)} disabled={restaurants.length === 0}>
                <option value="">Select</option>
                <option value="Stingy">Stingy</option>
                <option value="Fair">Fair</option>
                <option value="Generous">Generous</option>
              </select>
            </label>
            <label className="flavor-label">
              Flavor Rating:
              <select onChange={(e) => setFlavorFilter(e.target.value)} disabled={restaurants.length === 0}>
                <option value="">Select</option>
                <option value="EWWW Disgusting">EWWW Disgusting</option>
                <option value="It's just Ok">It's just Ok</option>
                <option value="Yummy Delicious">Yummy Delicious</option>
              </select>
            </label>
            <label className="service-label">
              Service:
              <select onChange={(e) => setServiceFilter(e.target.value)} disabled={restaurants.length === 0}>
                <option value="">Select</option>
                <option value="Terrible">Terrible</option>
                <option value="Good">Good</option>
                <option value="Exceptional">Exceptional</option>
              </select>
            </label>
          </div>
          {/* Conditionally render either the restaurant list or details view */}
          {!showDetails && !showRatingForm && (
            <ul className="restaurant-list">
              {filteredRestaurants.map((r, i) => {
                const flavorClass = `flavor-value flavor-${r.flavor.toLowerCase().replace(/['\s]/g, '-')}`;
                // Debug: Log the generated flavor class to troubleshoot bold issue
                console.log(`Generated flavor class for ${r.flavor}: ${flavorClass}`);
                return (
                  <li key={i} onClick={() => {
                    setSelectedRestaurant(r);
                    setShowDetails(true); // Show details view on click
                  }} style={{ cursor: 'pointer' }}>
                    <div className="restaurant-item">
                      <div className="rating-section">
                        <strong style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{r.name}</strong>
                        <br />
                        <br />
                        Rating: {getAverageRating(r.ratings).toFixed(1)}% ({r.ratings.total_reviews} reviews)
                      </div>
                      <div className="details-section">
                        <div>
                          Portion: <span className={`portion-value portion-${r.portion.toLowerCase().replace(/['\s]/g, '-')}`}>{r.portion}</span>
                        </div>
                        <div>
                          Flavor: <span className={flavorClass}>{r.flavor}</span>
                        </div>
                        <div>
                          Service: <span className={`service-value service-${r.service.toLowerCase().replace(/['\s]/g, '-')}`}>{r.service}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Details and rating form views, only render if selectedRestaurant is not null */}
          {selectedRestaurant && (showDetails || showRatingForm) ? (
            <div className="restaurant-details">
              {showDetails && !showRatingForm ? (
                <>
                  <h2>{selectedRestaurant.name}</h2>
                  <p>Address: {selectedRestaurant.address}</p>
                  <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRestaurant.address)}`, '_blank')}>
                    Directions to this place
                  </button>
                  <div className="rating-details">
                    <h3>Average Ratings</h3>
                    <p>Taste: {mapTasteToCategory(selectedRestaurant.ratings.sum_taste / selectedRestaurant.ratings.total_reviews)}</p>
                    <p>Portion: {mapPortionToCategory(selectedRestaurant.ratings.sum_portion / selectedRestaurant.ratings.total_reviews)}</p>
                    <p>Service: {mapServiceToCategory(selectedRestaurant.ratings.sum_service / selectedRestaurant.ratings.total_reviews)}</p>
                    <p>Eat there again?: {mapEatAgainToCategory(selectedRestaurant.ratings.sum_eat_again / selectedRestaurant.ratings.total_reviews)}</p>
                    <p>Order that dish again?: {mapOrderAgainToCategory(selectedRestaurant.ratings.sum_order_again / selectedRestaurant.ratings.total_reviews)}</p>
                  </div>
                  <button onClick={() => setShowRatingForm(true)}>Leave a Rating</button>
                  <button className="back-button" onClick={() => {
                    setShowDetails(false);
                    setSelectedRestaurant(null); // Clear selectedRestaurant to remove lingering div
                  }}>Back to List</button>
                </>
              ) : showRatingForm ? (
                <>
                  <h2>Rate {selectedRestaurant.name}</h2>
                  <div className="rating-form">
                    <label>
                      Taste:
                      <select value={ratingTaste} onChange={(e) => setRatingTaste(e.target.value)}>
                        <option value="0">Select</option>
                        <option value="1">EWWW Disgusting</option>
                        <option value="2">It's just Ok</option>
                        <option value="3">Yummy Delicious</option>
                      </select>
                    </label>
                    <label>
                      Portion:
                      <select value={ratingPortion} onChange={(e) => setRatingPortion(e.target.value)}>
                        <option value="0">Select</option>
                        <option value="1">Stingy</option>
                        <option value="2">Fair</option>
                        <option value="3">Generous</option>
                      </select>
                    </label>
                    <label>
                      Service:
                      <select value={ratingService} onChange={(e) => setRatingService(e.target.value)}>
                        <option value="0">Select</option>
                        <option value="1">Terrible</option>
                        <option value="2">Good</option>
                        <option value="3">Exceptional</option>
                      </select>
                    </label>
                    <label>
                      Eat there again?:
                      <select value={ratingEatAgain} onChange={(e) => setRatingEatAgain(e.target.value)}>
                        <option value="0">Select</option>
                        <option value="1">No</option>
                        <option value="2">Maybe</option>
                        <option value="3">Yes</option>
                      </select>
                    </label>
                    <label>
                      Order that dish again?:
                      <select value={ratingOrderAgain} onChange={(e) => setRatingOrderAgain(e.target.value)}>
                        <option value="0">Select</option>
                        <option value="1">No</option>
                        <option value="2">Maybe</option>
                        <option value="3">Yes</option>
                      </select>
                    </label>
                    <button onClick={submitRating}>Submit Rating</button>
                    <button onClick={() => setShowRatingForm(false)}>Back to Details</button>
                  </div>
                  {thankYouMessage && <p>Thank you for helping everyone!</p>}
                </>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default App;