const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));

// Import Mongoose models
const Review = require('./review');
const Dealership = require('./dealership');

// Connect to MongoDB
try {
  mongoose.connect('mongodb://mongo_db:27017/dealershipsDB');
} catch (error) {
  console.log("Error connecting to MongoDB", error);
}

// Default route
app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealership.find();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers' });
  }
});

// Fetch all dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealership.find({ state: req.params.state });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by state' });
  }
});

// Fetch dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    // Some datasets use string for ID, some use number. Using find to match the schema.
    const dealer = await Dealership.find({ id: req.params.id });
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ dealership: req.params.id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews for dealer' });
  }
});

// Insert a new review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const review = new Review({
      "name": data.name,
      "dealership": data.dealership,
      "review": data.review,
      "purchase": data.purchase,
      "purchase_date": data.purchase_date,
      "car_make": data.car_make,
      "car_model": data.car_model,
      "car_year": data.car_year
    });
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});