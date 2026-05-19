const express = require('express');
const router = express.Router();
const WeatherService = require('../services/weatherService');

router.get('/current', async (req, res) => {
  try {
    const weather = await WeatherService.getWeatherMyCity();
    res.json({ success: true, weather });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

router.get('/by-city', async (req, res) => {
  try {
    const weather = await WeatherService.getWeatherByCity(req.query.city);
    res.json({ success: true, weather });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather by city' });
  }
});

module.exports = router;
