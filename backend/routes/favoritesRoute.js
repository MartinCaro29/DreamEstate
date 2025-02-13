const express = require('express');
const router = express.Router();
const Favorites = require('../models/favoritesModel');

// Add a property to favorites
router.post('/addFavorite', async (req, res) => {
  const { user_id, property_id } = req.body;
  
  try {
    const existingFavorite = await Favorites.findOne({ user_id, property_id });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = new Favorites({ user_id, property_id });
    await favorite.save();

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a property from favorites
router.delete('/removeFavorite', async (req, res) => {
  const { user_id, property_id } = req.body;

  try {
    const result = await Favorites.findOneAndDelete({ user_id, property_id });
    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all favorites for a user
router.get('/favorites/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const favorites = await Favorites.find({ user_id }).populate('property_id');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
