const express = require('express');
const cors = require('cors');
const app = express();
let restaurants;

try {
  restaurants = require('./restaurants.json');
  console.log('Restaurants loaded:', restaurants);
} catch (err) {
  console.error('Error loading restaurants.json:', err);
  process.exit(1);
}

app.get('/restaurants', (req, res) => {
  console.log('Received request for /restaurants');
  res.json(restaurants);
});

app.get('/', (req, res) => {
  console.log('Received request for /');
  res.json({ message: 'Welcome to the Portion & Flavor API' });
});

app.use(cors({
  origin: 'https://glorious-space-waddle-7v76jrwjgpp93rjq5-3001.app.github.dev',
}));
app.use(express.json());

app.use((req, res) => {
  console.log('Catch-all route hit:', req.url);
  res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));