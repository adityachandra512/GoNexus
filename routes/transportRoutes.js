import express from 'express';
const router = express.Router();
import { getFlightOptions, searchFlights } from '../controllers/transportController.js';

// Original route for single airport flights
router.route('/flights/:airportCode').get(getFlightOptions);

// New route for searching flights between airports
router.route('/flights').post(searchFlights);

// Add this route if missing
router.get('/places/autocomplete', async (req, res) => {
  try {
    // Your implementation here
    res.json({ predictions: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;