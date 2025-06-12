import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();

const app = express();

// Simple CORS configuration (for development)
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));

// Other middleware
app.use(express.json());

// Add a simple health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'GoNexus Backend API is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));