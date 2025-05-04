const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'https://glorious-space-waddle-7v76jrwjgpp93rjq5-3001.app.github.dev',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Load restaurants from JSON file
const restaurantsFile = path.join(__dirname, 'restaurants.json');
let restaurants = JSON.parse(fs.readFileSync(restaurantsFile, 'utf8'));

// Function to save restaurants to JSON file
const saveRestaurants = () => {
  fs.writeFileSync(restaurantsFile, JSON.stringify(restaurants, null, 2));
};

// Function to update averages after adding a new rating
const updateAverages = (restaurant) => {
  const { total_reviews, sum_flavor, sum_portion, sum_service, sum_eat_again, sum_order_again } = restaurant.ratings;
  if (total_reviews === 0) return;

  restaurant.ratings.average_flavor = sum_flavor / total_reviews;
  restaurant.ratings.average_portion = sum_portion / total_reviews;
  restaurant.ratings.average_service = sum_service / total_reviews;
  restaurant.ratings.average_eat_again = sum_eat_again / total_reviews;
  restaurant.ratings.average_order_again = sum_order_again / total_reviews;
};

// GET /restaurants - Get all restaurants
app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

// POST /restaurants/:id/ratings - Submit a new rating
app.post('/restaurants/:id/ratings', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { flavor, portion, service, eat_again, order_again } = req.body;

  // Validate input (1-3 scale for all ratings)
  if (!flavor || !portion || !service || !eat_again || !order_again ||
      flavor < 1 || flavor > 3 || portion < 1 || portion > 3 || service < 1 || service > 3 ||
      eat_again < 1 || eat_again > 3 || order_again < 1 || order_again > 3) {
    return res.status(400).json({ error: 'Invalid rating values, must be 1-3' });
  }

  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  // Update sums and total_reviews
  restaurant.ratings.total_reviews += 1;
  restaurant.ratings.sum_flavor += flavor;
  restaurant.ratings.sum_portion += portion;
  restaurant.ratings.sum_service += service;
  restaurant.ratings.sum_eat_again += eat_again;
  restaurant.ratings.sum_order_again += order_again;

  // Optionally, add to samples if needed (keep last 5 for display)
  if (restaurant.ratings.samples.length >= 5) {
    restaurant.ratings.samples.shift(); // Remove oldest sample
  }
  restaurant.ratings.samples.push({ flavor, portion, service, eat_again, order_again });

  updateAverages(restaurant); // Recalculate averages
  saveRestaurants(); // Save updated data to file

  res.status(201).json({ message: 'Rating submitted successfully' });
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));