import express from 'express';
const router = express.Router();
import { getFlightOptions } from '../controllers/transportController.js';

// @desc    Get flight options for an airport
// @route   GET /api/transport/flights/:airportCode
// @access  Public (or Private, add authMiddleware if needed)
router.route('/flights/:airportCode').get(getFlightOptions);

export default router;