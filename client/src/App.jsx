import { useState, useEffect } from 'react';
import './App.css';

// Main App component for the Portion & Flavor App
function App() {
  // State management for app data and UI control
  const [restaurants, setRestaurants] = useState([]); // Stores the list of all restaurants fetched from the server
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Stores the filtered list of restaurants based on user input
  const [error, setError] = useState(null); // Tracks any errors during data fetching
  const [loading, setLoading] = useState(true); // Manages the loading state while fetching data
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Stores the currently selected restaurant for detailed view
  const [ratingFlavor, setRatingFlavor] = useState(0); // Stores the flavor rating input by the user (changed from ratingTaste)
  const [ratingPortion, setRatingPortion] = useState(0); // Stores the portion rating input by the user
  const [ratingService, setRatingService] = useState(0); // Stores the service rating input by the user
  const [ratingEatAgain, setRatingEatAgain] = useState(0); // Stores the "eat again" rating input by the user
  const [ratingOrderAgain, setRatingOrderAgain] = useState(0); // Stores the "order again" rating input by the user
  const [thankYouMessage, setThankYouMessage] = useState(false); // Controls the display of a thank-you message after rating submission
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term for filtering restaurants by name
  const [portionFilter, setPortionFilter] = useState(''); // Stores the portion size filter value
  const [flavorFilter, setFlavorFilter] = useState(''); // Stores the flavor rating filter value
  const [serviceFilter, setServiceFilter] = useState(''); // Stores the service quality filter value
  const [sortByRating, setSortByRating] = useState(false); // Toggles sorting of restaurants by average rating
  const [showRatingForm, setShowRatingForm] = useState(false); // Controls the visibility of the rating form
  const [showDetails, setShowDetails] = useState(false); // Controls the visibility of the restaurant details view

  // Fetch restaurant data on component mount
  useEffect(() => {
    setLoading(true); // Set loading state to true while fetching
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
          const updatedData = data.map(r => {
            if (r.name === 'Nobu Malibu') {
              return {
                ...r,
                name: 'Nobu Los Angeles',
                address: '903 N La Cienega Blvd, Los Angeles, CA 90069'
              };
            }
            return r;
          });
          setRestaurants(updatedData); // Update restaurants state with fetched data
          setFilteredRestaurants(updatedData); // Initialize filtered list with all restaurants
        } else {
          throw new Error('Fetched data is not an array');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load restaurants: ' + err.message); // Set error message if fetch fails
      })
      .finally(() => setLoading(false)); // Set loading to false after fetch completes
  }, []); // Empty dependency array ensures this runs only once on mount

  // Calculate the average rating for a restaurant based on its ratings
  const getAverageRating = (ratings) => {
    if (ratings.total_reviews === 0) return 0; // Return 0 if no reviews exist
    const avgFlavor = ratings.sum_flavor / ratings.total_reviews; // Calculate average flavor (changed from sum_taste)
    const avgPortion = ratings.sum_portion / ratings.total_reviews; // Calculate average portion
    const avgService = ratings.sum_service / ratings.total_reviews; // Calculate average service
    const avgEatAgain = ratings.sum_eat_again / ratings.total_reviews; // Calculate average "eat again"
    const avgOrderAgain = ratings.sum_order_again / ratings.total_reviews; // Calculate average "order again"
    const overallAverage = (avgFlavor + avgPortion + avgService + avgEatAgain + avgOrderAgain) / 5; // Compute overall average
    return (overallAverage / 3) * 100; // Convert to percentage (max rating per category is 3)
  };

  // Map average flavor score to a category (used to be mapTasteToCategory)
  const mapFlavorToCategory = (avgFlavor) => {
    if (avgFlavor <= 1.5) return 'Not so Good';
    if (avgFlavor <= 2.5) return "It's just Ok";
    return 'Yummy Delicious';
  };

  // Map average portion score to a category
  const mapPortionToCategory = (avgPortion) => {
    if (avgPortion <= 1.5) return 'Stingy';
    if (avgPortion <= 2.5) return 'Fair';
    return 'Generous';
  };

  // Map average service score to a category
  const mapServiceToCategory = (avgService) => {
    if (avgService <= 1.5) return 'Terrible';
    if (avgService <= 2.5) return 'Good';
    return 'Exceptional';
  };

  // Map average "eat again" score to a category
  const mapEatAgainToCategory = (avgEatAgain) => {
    if (avgEatAgain <= 1.5) return 'No';
    if (avgEatAgain <= 2.5) return 'Maybe';
    return 'Yes';
  };

  // Map average "order again" score to a category
  const mapOrderAgainToCategory = (avgOrderAgain) => {
    if (avgOrderAgain <= 1.5) return 'No';
    if (avgOrderAgain <= 2.5) return 'Maybe';
    return 'Yes';
  };

  // Handle submission of a new rating for the selected restaurant
  const submitRating = () => {
    // Validate ratings (must be between 1 and 3)
    if (!ratingFlavor || !ratingPortion || !ratingService || !ratingEatAgain || !ratingOrderAgain ||
        ratingFlavor < 1 || ratingFlavor > 3 || ratingPortion < 1 || ratingPortion > 3 ||
        ratingService < 1 || ratingService > 3 || ratingEatAgain < 1 || ratingEatAgain > 3 ||
        ratingOrderAgain < 1 || ratingOrderAgain > 3) {
      alert('Please provide valid ratings (1-3)');
      return;
    }
    const rating = {
      flavor: parseInt(ratingFlavor, 10), // Convert flavor rating to integer (changed from taste)
      portion: parseInt(ratingPortion, 10), // Convert portion rating to integer
      service: parseInt(ratingService, 10), // Convert service rating to integer
      eat_again: parseInt(ratingEatAgain, 10), // Convert "eat again" rating to integer
      order_again: parseInt(ratingOrderAgain, 10), // Convert "order again" rating to integer
    };
    // Send rating to the server
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
        setThankYouMessage(true); // Show thank-you message after successful submission
        setTimeout(() => {
          setThankYouMessage(false); // Hide thank-you message after 3 seconds
          setShowRatingForm(false); // Hide the rating form
        }, 3000);
        // Refresh restaurant data after submission
        fetch('https://glorious-space-waddle-7v76jrwjgpp93rjq5-3000.app.github.dev/restaurants')
          .then(res => res.json())
          .then(data => {
            setRestaurants(data); // Update restaurants list
            setFilteredRestaurants(data); // Update filtered list
            setSelectedRestaurant(data.find(r => r.id === selectedRestaurant.id)); // Update selected restaurant
          });
        // Reset rating inputs
        setRatingFlavor(0); // Changed from setRatingTaste
        setRatingPortion(0);
        setRatingService(0);
        setRatingEatAgain(0);
        setRatingOrderAgain(0);
      })
      .catch(err => {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating'); // Show error if submission fails
      });
  };

  // Filter and sort restaurants based on user input
  useEffect(() => {
    let filtered = restaurants; // Start with the full list of restaurants
    if (searchTerm) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())); // Filter by restaurant name
    }
    if (portionFilter) {
      filtered = filtered.filter(r => r.portion === portionFilter); // Filter by portion size
    }
    if (flavorFilter) {
      filtered = filtered.filter(r => r.flavor === flavorFilter); // Filter by flavor rating
    }
    if (serviceFilter) {
      filtered = filtered.filter(r => r.service === serviceFilter); // Filter by service quality
    }
    if (sortByRating) {
      filtered = filtered.sort((a, b) => {
        const aRating = getAverageRating(a.ratings);
        const bRating = getAverageRating(b.ratings);
        return bRating - aRating; // Sort by average rating in descending order
      });
    }
    setFilteredRestaurants(filtered); // Update the filtered list
  }, [restaurants, searchTerm, portionFilter, flavorFilter, serviceFilter, sortByRating]); // Dependencies for re-running the effect

  // Render the UI based on app state
  return (
    <div className="App">
      <h1>Portion & Flavor App</h1>
      {loading ? (
        <p className="loading">Loading...</p> // Display loading message while fetching data
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // Display error message if fetch fails
      ) : !showDetails && !showRatingForm ? (
        // Main view: List of restaurants with search and filter controls
        <>
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
                <option value="Not so Good">Not so Good</option>
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
          <ul className="restaurant-list">
            {filteredRestaurants.map((r, i) => {
              const flavorClass = `flavor-value flavor-${r.flavor.toLowerCase().replace(/['\s]/g, '-')}`;
              return (
                <li key={i} onClick={() => {
                  setSelectedRestaurant(r);
                  setShowDetails(true);
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
        </>
      ) : (
        // Detailed view: Restaurant details or rating form
        <div className="restaurant-details">
          {showDetails && !showRatingForm ? (
            // Restaurant details view
            <>
              <h2>{selectedRestaurant.name}</h2>
              <p>Address: {selectedRestaurant.address}</p>
              <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRestaurant.name + ", " + selectedRestaurant.address)}`, '_blank')}>
                Directions to this place
              </button>
              <div className="rating-details">
                <h3>Average Ratings</h3>
                <p>Flavor: {mapFlavorToCategory(selectedRestaurant.ratings.sum_flavor / selectedRestaurant.ratings.total_reviews)}</p> {/* Changed from Taste */}
                <p>Portion: {mapPortionToCategory(selectedRestaurant.ratings.sum_portion / selectedRestaurant.ratings.total_reviews)}</p>
                <p>Service: {mapServiceToCategory(selectedRestaurant.ratings.sum_service / selectedRestaurant.ratings.total_reviews)}</p>
                <p>Eat there again?: {mapEatAgainToCategory(selectedRestaurant.ratings.sum_eat_again / selectedRestaurant.ratings.total_reviews)}</p>
                <p>Order that dish again?: {mapOrderAgainToCategory(selectedRestaurant.ratings.sum_order_again / selectedRestaurant.ratings.total_reviews)}</p>
              </div>
              <div className="button-container">
                <button className="back-button" onClick={() => {
                  setShowDetails(false);
                  setSelectedRestaurant(null);
                }}>Back to List</button>
                <button onClick={() => setShowRatingForm(true)}>Leave a Rating</button>
              </div>
            </>
          ) : showRatingForm ? (
            // Rating form view
            <>
              <h2>Rate {selectedRestaurant.name}</h2>
              <div className="rating-form">
                <label>
                  Flavor: {/* Changed from Taste */}
                  <select value={ratingFlavor} onChange={(e) => setRatingFlavor(e.target.value)}>
                    <option value="0">Select</option>
                    <option value="1">Not so Good</option>
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
                <div className="button-container">
                  <button className="back-button" onClick={() => setShowRatingForm(false)}>Back to Details</button>
                  <button onClick={submitRating}>Submit Rating</button>
                </div>
              </div>
              {thankYouMessage && <p>Thank you for helping everyone by leaving a review!</p>}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;