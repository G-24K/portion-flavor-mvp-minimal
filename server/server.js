const express = require('express');
const cors = require('cors');
const app = express();
const restaurants = require('./restaurants.json');

app.use(cors());
app.use(express.json());

app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));