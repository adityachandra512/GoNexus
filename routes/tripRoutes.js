import express from 'express';
import { planTrip } from '../controllers/tripController.js';

const router = express.Router();

// POST /api/trips/plan - Plan a trip and get transport options
router.post('/plan', planTrip);

export default router;
