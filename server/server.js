const express = require('express');
const cors = require('cors');
const app = express();
let restaurants;

try {
  restaurants = require('./restaurants.json');
} catch (err) {
  console.error('Error loading restaurants.json:', err);
  process.exit(1); // Exit if the file fails to load
}

app.use(cors());
app.use(express.json());

app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));