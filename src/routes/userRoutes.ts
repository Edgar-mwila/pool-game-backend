// src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';

const router = Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to log in
router.get('/login', loginUser);

// Route to get user profile
router.put('/get-profile', getUserProfile);

export default router;
