// src/app.ts
import express from 'express';
import gameRoutes from './routes/gameRoutes';
import userRoutes from './routes/userRoutes'
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

const app = express();

app.use(express.json()); // Middleware to parse JSON
// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(json());
app.use(urlencoded({ extended: true }));

// Use the routes
app.use('/api/games', gameRoutes);
app.use('/api/auth', userRoutes);

// Error handling middleware (optional)
app.use((err: any, res ) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
